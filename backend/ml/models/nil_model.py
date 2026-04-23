"""PyTorch NIL valuation model with a learned position embedding.

Architecture
------------
- Position embedding: ``nn.Embedding(num_positions, embedding_dim)``.
- Concatenate the embedding with the numeric stat vector and context
  features. The stat vector is the fixed-order union of all per-position
  stats, zero-filled for fields not applicable to the position.
- Two or three hidden MLP layers with ReLU and dropout.
- Regression head with a single scalar output in log-USD space.
- Huber loss with configurable delta.

The module deliberately avoids any hard-coded feature dimension. Callers pass
``numeric_feature_dim`` at construction time.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable

import torch
from torch import nn


@dataclass
class NILModelConfig:
    """Hyperparameters for the main NIL model.

    Attributes
    ----------
    num_positions : int
        Size of the position vocabulary. 5 for QB, WR, TE, MLB, S.
    position_embedding_dim : int
    numeric_feature_dim : int
        Length of the concatenated stat + context vector.
    hidden_layers : iterable of int
        Sizes of each hidden layer.
    dropout : float
    activation : str
        Name of the activation. Only ``"relu"`` is wired up; any other value
        falls back to ReLU.
    """

    num_positions: int
    position_embedding_dim: int
    numeric_feature_dim: int
    hidden_layers: Iterable[int] = (128, 64, 32)
    dropout: float = 0.2
    activation: str = "relu"


class NILModel(nn.Module):
    """Main NIL valuation model.

    Inputs
    ------
    position_ids : LongTensor of shape ``(batch,)``
    numeric : FloatTensor of shape ``(batch, numeric_feature_dim)``

    Output
    ------
    FloatTensor of shape ``(batch,)`` with a regression value in log-USD
    space. The training loop applies Huber loss against log-transformed
    targets.
    """

    def __init__(self, config: NILModelConfig) -> None:
        super().__init__()
        self.config = config
        self.position_embedding = nn.Embedding(
            num_embeddings=config.num_positions,
            embedding_dim=config.position_embedding_dim,
        )

        layers: list[nn.Module] = []
        in_dim = config.numeric_feature_dim + config.position_embedding_dim
        for hidden in config.hidden_layers:
            layers.append(nn.Linear(in_dim, hidden))
            layers.append(_activation(config.activation))
            if config.dropout > 0:
                layers.append(nn.Dropout(config.dropout))
            in_dim = hidden
        layers.append(nn.Linear(in_dim, 1))
        self.mlp = nn.Sequential(*layers)

    def forward(self, position_ids: torch.Tensor, numeric: torch.Tensor) -> torch.Tensor:
        """Return predicted log-USD NIL value.

        Parameters
        ----------
        position_ids : torch.LongTensor, shape (batch,)
        numeric : torch.FloatTensor, shape (batch, numeric_feature_dim)

        Returns
        -------
        torch.FloatTensor, shape (batch,)
        """
        emb = self.position_embedding(position_ids)
        x = torch.cat([numeric, emb], dim=-1)
        out = self.mlp(x).squeeze(-1)
        return out


def _activation(name: str) -> nn.Module:
    """Resolve the activation by name. Falls back to ReLU."""
    if name.lower() == "relu":
        return nn.ReLU()
    if name.lower() == "gelu":
        return nn.GELU()
    return nn.ReLU()


def build_huber_loss(delta: float) -> nn.Module:
    """Return a Huber loss module with the given delta.

    Parameters
    ----------
    delta : float

    Returns
    -------
    nn.Module
    """
    return nn.HuberLoss(delta=delta, reduction="mean")
