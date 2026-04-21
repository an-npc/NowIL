"""Tests for the PyTorch models and XGBoost baseline helpers."""

from __future__ import annotations

import numpy as np
import torch

from models.lstm_realtime import LSTMAdjustmentConfig, LSTMAdjustmentHead, pad_game_sequence
from models.nil_model import NILModel, NILModelConfig, build_huber_loss
from models.xgboost_baseline import build_xgboost_features, one_hot_positions


def test_nil_model_forward_shape():
    cfg = NILModelConfig(
        num_positions=5,
        position_embedding_dim=8,
        numeric_feature_dim=32,
        hidden_layers=(64, 32),
        dropout=0.1,
    )
    model = NILModel(cfg)
    pos = torch.tensor([0, 1, 2, 3, 4], dtype=torch.long)
    x = torch.randn(5, 32)
    out = model(pos, x)
    assert out.shape == (5,)
    assert out.dtype == torch.float32


def test_nil_model_backward_produces_gradients():
    cfg = NILModelConfig(
        num_positions=5,
        position_embedding_dim=4,
        numeric_feature_dim=10,
        hidden_layers=(16,),
        dropout=0.0,
    )
    model = NILModel(cfg)
    pos = torch.tensor([0, 2], dtype=torch.long)
    x = torch.randn(2, 10)
    target = torch.tensor([10.0, 12.0])
    loss_fn = build_huber_loss(1.0)
    preds = model(pos, x)
    loss = loss_fn(preds, target)
    loss.backward()
    grads_present = [p.grad is not None and p.grad.abs().sum().item() > 0 for p in model.parameters()]
    assert any(grads_present)


def test_nil_model_trains_to_reduce_loss_on_toy_data():
    torch.manual_seed(0)
    cfg = NILModelConfig(
        num_positions=5,
        position_embedding_dim=4,
        numeric_feature_dim=3,
        hidden_layers=(8,),
        dropout=0.0,
    )
    model = NILModel(cfg)
    # Synthetic fixed target per position: NIL scales with position id.
    pos = torch.tensor([0, 1, 2, 3, 4] * 8, dtype=torch.long)
    x = torch.randn(pos.shape[0], 3)
    y = pos.float() * 2.0 + 1.0
    loss_fn = build_huber_loss(1.0)
    optim = torch.optim.AdamW(model.parameters(), lr=0.05)
    initial_loss = loss_fn(model(pos, x), y).item()
    for _ in range(200):
        optim.zero_grad()
        preds = model(pos, x)
        loss = loss_fn(preds, y)
        loss.backward()
        optim.step()
    final_loss = loss_fn(model(pos, x), y).item()
    assert final_loss < initial_loss
    # Loose bound: model should be able to learn the position-driven signal.
    assert final_loss < 0.5


def test_lstm_adjustment_head_forward_shape():
    cfg = LSTMAdjustmentConfig(
        num_positions=5,
        position_embedding_dim=4,
        game_feature_dim=19,
        sequence_length=5,
        hidden_dim=16,
        num_layers=1,
        dropout=0.0,
    )
    head = LSTMAdjustmentHead(cfg)
    pos = torch.tensor([0, 3], dtype=torch.long)
    seq = torch.randn(2, 5, 19)
    out = head(pos, seq)
    assert out.shape == (2,)


def test_pad_game_sequence_left_pads_short_sequences():
    v1 = torch.tensor([1.0, 2.0])
    v2 = torch.tensor([3.0, 4.0])
    padded = pad_game_sequence([v1, v2], sequence_length=5, feature_dim=2)
    assert padded.shape == (5, 2)
    # First three rows should be zero, last two should be v1 then v2.
    assert torch.allclose(padded[:3], torch.zeros(3, 2))
    assert torch.allclose(padded[3], v1)
    assert torch.allclose(padded[4], v2)


def test_pad_game_sequence_truncates_long_sequences():
    vectors = [torch.tensor([float(i), float(i)]) for i in range(10)]
    padded = pad_game_sequence(vectors, sequence_length=3, feature_dim=2)
    assert padded.shape == (3, 2)
    # Should keep the most recent 3.
    assert torch.allclose(padded[0], torch.tensor([7.0, 7.0]))
    assert torch.allclose(padded[2], torch.tensor([9.0, 9.0]))


def test_one_hot_positions():
    ids = np.array([0, 2, 4, 1], dtype=np.int64)
    out = one_hot_positions(ids, 5)
    assert out.shape == (4, 5)
    assert out[0].tolist() == [1, 0, 0, 0, 0]
    assert out[1].tolist() == [0, 0, 1, 0, 0]
    assert out[2].tolist() == [0, 0, 0, 0, 1]


def test_build_xgboost_features_concatenates_one_hot_and_numeric():
    ids = np.array([0, 1], dtype=np.int64)
    numeric = np.array([[1.0, 2.0], [3.0, 4.0]], dtype=np.float32)
    out = build_xgboost_features(ids, numeric, num_positions=5)
    assert out.shape == (2, 5 + 2)
    # Row 0: position 0 one-hot + [1, 2]
    assert out[0].tolist() == [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 2.0]
    assert out[1].tolist() == [0.0, 1.0, 0.0, 0.0, 0.0, 3.0, 4.0]
