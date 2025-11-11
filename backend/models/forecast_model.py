import numpy as np
from datetime import datetime, timedelta

def simple_aqi_forecast(aqi_history: list, hours_ahead: int = 6):
    """
    Predicts future AQI values based on last N historical readings
    using a simple linear trend extrapolation.
    """
    if not aqi_history:
        return {"error": "No AQI history available for forecasting."}

    # Sort by timestamp
    sorted_data = sorted(aqi_history, key=lambda x: x["timestamp"])
    values = np.array([x["aqi"] for x in sorted_data])
    timestamps = np.array([i for i in range(len(values))])

    # Fit simple linear model (y = mx + b)
    try:
        m, b = np.polyfit(timestamps, values, 1)
    except Exception:
        return {"error": "Not enough data for forecasting."}

    # Predict next N hours
    forecast = []
    for i in range(1, hours_ahead + 1):
        next_value = float(m * (len(values) + i) + b)
        next_time = datetime.utcnow() + timedelta(hours=i)
        forecast.append({
            "hour": i,
            "timestamp": next_time.isoformat(),
            "predicted_aqi": max(0, round(next_value, 2))
        })

    return {"forecast": forecast}
