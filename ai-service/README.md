# UMKM Bersama — AI Service

AI Service for UMKM Bersama — a smart financial assistant system that helps small warung owners manage their business finances through automated predictions and recommendations.

**Production URL:** https://umkm-bersama-production.up.railway.app  
**API Documentation:** https://umkm-bersama-production.up.railway.app/docs  
**Team:** CC26-PSU328 | Coding Camp 2026 powered by DBS Foundation

---

## Features

- **Cash Flow Forecasting** — Predict daily net cash flow using LSTM Deep Learning model
- **BCG Matrix Classification** — Classify products into Star, Cash Cow, Question Mark, and Dog quadrants using K-Means Clustering
- **Anomaly Detection** — Detect unusual expenditures per category (HPP, Operational, Overhead) using Isolation Forest
- **Advisory Layer** — Generate automatic business recommendations by combining all model outputs

---

## ML Model Files

All trained model files are available for download:  
🔗 **[https://drive.google.com/drive/folders/1tcLo08231gebUamb8n-x0VMO4ZWwmB38?usp=sharing]**

> Make sure to place all downloaded files inside the `models/` directory before running the app.

| File | Description |
|------|-------------|
| `cashflow_lstm.keras` | LSTM model for cash flow forecasting |
| `scaler.pkl` | MinMaxScaler for LSTM preprocessing |
| `kmeans_bcg.pkl` | K-Means model for BCG Matrix |
| `scaler_bcg.pkl` | StandardScaler for BCG preprocessing |
| `bcg_cluster_mapping.json` | Cluster to quadrant mapping |
| `iforest_hpp.pkl` | Isolation Forest for HPP category |
| `iforest_operasional.pkl` | Isolation Forest for Operational category |
| `iforest_overhead.pkl` | Isolation Forest for Overhead category |
| `scaler_anomaly_hpp.pkl` | Scaler for HPP anomaly model |
| `scaler_anomaly_operasional.pkl` | Scaler for Operational anomaly model |
| `scaler_anomaly_overhead.pkl` | Scaler for Overhead anomaly model |
| `le_kategori_anomaly.pkl` | Label Encoder for anomaly categories |
| `anomaly_metadata.json` | Anomaly model metadata and feature columns |

---

## Project Structure

---

## Tech Stack

- **Python 3.11**
- **TensorFlow 2.21** — LSTM Deep Learning model
- **Scikit-learn** — Isolation Forest & K-Means Clustering
- **FastAPI** — REST API framework
- **Uvicorn** — ASGI server
- **Joblib** — Model serialization
- **Pandas & NumPy** — Data processing
- **Railway** — Cloud deployment

---

## Setup & Installation

### Prerequisites

- Python 3.11
- pip

### Steps

**1. Clone the repository:**
```bash
git clone https://github.com/VirginiaSimanungkalit/umkm-bersama.git
cd umkm-bersama/ai-service
```

**2. Install dependencies:**
```bash
pip install -r requirements.txt
```

**3. Download model files:**

Download all model files from [https://drive.google.com/drive/folders/1tcLo08231gebUamb8n-x0VMO4ZWwmB38?usp=sharing] and place them inside the `models/` directory.

---

## Running the Application

### Run Locally
```bash
uvicorn app.main:app --reload --port 8000
```

Open your browser: http://127.0.0.1:8000/docs

### Access Production

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Check service status |
| GET | `/health` | Health check |
| POST | `/api/ai/cashflow-forecast` | Predict cash flow |
| POST | `/api/ai/bcg-matrix` | Classify products (BCG) |
| POST | `/api/ai/anomaly` | Detect anomalous expenditure |
| POST | `/api/ai/advisory` | Get automated business recommendations |

### Example Request — Cash Flow Forecast
```json
POST /api/ai/cashflow-forecast
Content-Type: application/json

{
  "data_30_hari": [50000.0, 45000.0, 60000.0, 30000.0, ...]
}
```

### Example Response
```json
{
  "prediksi_cashflow_besok": 45231.5,
  "status": "positif",
  "peringatan": null,
  "satuan": "Rupiah"
}
```

---

## Model Performance

| Model | Metric | Value |
|-------|--------|-------|
| LSTM Cash Flow | MAE | 0.0238 |
| K-Means BCG Matrix | Silhouette Score | 0.5274 |
| K-Means BCG Matrix | Davies-Bouldin | 0.6195 |
| Isolation Forest | Contamination | 3% |

---

## Model Attribution

The LSTM Cash Flow model and Advisory Layer were built independently
by the AI Engineer team.

The following models were developed by the **Data Science team**
and integrated into this AI Service:

- Isolation Forest models (anomaly detection)
- K-Means BCG Matrix model

---