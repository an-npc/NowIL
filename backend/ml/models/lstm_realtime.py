"""LSTM head that produces a real-time NIL adjustment from recent games.

The idea: the season model provides a stable baseline prediction from the
aggregated season stats. During an in-progress season, fresh game-by-game
performance should nudge the valuation up or down. The LSTM consumes the
last N game stat vectors (chronological), produces a scalar adjustment in
log-USD space, and the final prediction is:

    log_nil_hat = season_model(...) + lstm_adjustment(recent_games)

The adjustment is additive in log-space, which is multiplicative in USD
space. A value of +0.1 means a roughly 10 percent upward bump.

All game stat fields are expected to match ``data.schema.GameStats`` in a
fixed order supplied by the caller.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable

import torch
from torch import nn


@dataclass
class LSTMAdjustmentConfig:
    """Hyperparameters for the LSTM adjustment head.

    Attributes
    ----------
    num_positions : int
    position_embedding_dim : int
        Position embedding is re-learned here rather than shared with the
        season model. This keeps the two heads independently trainable.
    game_feature_dim : int
        Length of each game's stat vector.
    sequence_length : int
        Expected input timesteps. Inputs with fewer timesteps should be
        left-padded with zeros.
    hidden_dim : int
    num_layers : int
    dropout : float
    """

    num_positions: int
    position_embedding_dim: int
    game_feature_dim: int
    sequence_length: int = 5
    hidden_dim: int = 32
    num_layers: int = 1
    dropout: float = 0.1


class LSTMAdjustmentHead(nn.Module):
    """Produces a scalar log-space NIL adjustment from recent games.

    Inputs
    ------
    position_ids : LongTensor of shape ``(batch,)``
    game_sequence : FloatTensor of shape
        ``(batch, sequence_length, game_feature_dim)``

    Output
    ------
    FloatTensor of shape ``(batch,)``: additive adjustment in log-USD space.
    """

    def __init__(self, config: LSTMAdjustmentConfig) -> None:
        super().__init__()
        self.config = config
        self.position_embedding = nn.Embedding(
            num_embeddings=config.num_positions,
            embedding_dim=config.position_embedding_dim,
        )
        self.lstm = nn.LSTM(
            input_size=config.game_feature_dim,
            hidden_size=config.hidden_dim,
            num_layers=config.num_layers,
            batch_first=True,
            dropout=config.dropout if config.num_layers > 1 else 0.0,
        )
        self.head = nn.Sequential(
            nn.Linear(config.hidden_dim + config.position_embedding_dim, config.hidden_dim),
            nn.ReLU(),
            nn.Linear(config.hidden_dim, 1),
        )

    def forward(
        self,
        position_ids: torch.Tensor,
        game_sequence: torch.Tensor,
    ) -> torch.Tensor:
        """Return the log-USD adjustment.

        Parameters
        ----------
        position_ids : torch.LongTensor, shape (batch,)
        game_sequence : torch.FloatTensor,
            shape (batch, sequence_length, game_feature_dim)

        Returns
        -------
        torch.FloatTensor, shape (batch,)
        """
        _, (hidden, _) = self.lstm(game_sequence)
        last_hidden = hidden[-1]  # (batch, hidden_dim)
        emb = self.position_embedding(position_ids)
        x = torch.cat([last_hidden, emb], dim=-1)
        return self.head(x).squeeze(-1)


def pad_game_sequence(
    game_vectors: Iterable[torch.Tensor],
    sequence_length: int,
    feature_dim: int,
) -> torch.Tensor:
    """Left-pad a list of game vectors to a fixed sequence length.

    Parameters
    ----------
    game_vectors : iterable of torch.Tensor
        Each tensor has shape ``(feature_dim,)``. Order must be chronological:
        oldest first, most recent last.
    sequence_length : int
    feature_dim : int

    Returns
    -------
    torch.FloatTensor of shape ``(sequence_length, feature_dim)``
    """
    vectors = list(game_vectors)
    if len(vectors) > sequence_length:
        vectors = vectors[-sequence_length:]
    padded = torch.zeros((sequence_length, feature_dim), dtype=torch.float32)
    offset = sequence_length - len(vectors)
    for i, v in enumerate(vectors):
        padded[offset + i] = v
    return padded
