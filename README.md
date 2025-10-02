🌬️ Air Quality Dashboard
LIVE LINK:https://stalwart-brigadeiros-af1b20.netlify.app/

A modern, interactive dashboard for visualizing, analyzing, and forecasting air quality trends across cities worldwide. This project combines predictive analytics, advanced visualizations, and AI-powered insights to provide actionable health and policy recommendations.

Features
1. Predictive Analytics

Forecasts AQI trends for the next 7–30 days using Prophet (or ARIMA/LSTM).

Displays predicted values as dashed line overlay on AQI trend charts.

2. Health & Policy Impact Insights

Health Advisory Card: Example — “On average, 4 days this month were Hazardous in Delhi. Suggested: Stay indoors, use air purifiers.”

Policy Insight Card: Example — “Reducing PM2.5 in Beijing by 10% could improve AQI by 15 points.”

3. Advanced Visualizations

Animated Timeline Map / Geo Heatmap: Visualizes air quality changes across cities over time.

Parallel Coordinates Chart: Compare multiple pollutants across cities.

4. Personalized User Experience

Save custom dashboard views (e.g., city comparisons).

Dark/light theme toggle for UI flexibility.

5. AI-Powered Insights

Automatic natural language summaries:
Example — “AQI in New Delhi peaked in June due to high PM2.5 levels. London maintained consistently good air quality, except for slight NO₂ spikes in November.”

6. Export & Reporting

One-click PDF or image export of dashboard with charts and key KPIs.

Mobile-friendly responsive design for demo on any device.

Color Scheme (AQI Levels)
AQI Level	Color	Hex
Good	Green	#00B050
Moderate	Yellow	#FFD966
Unhealthy for Sensitive Groups	Orange	#ED7D31
Unhealthy	Red	#C00000
Very Unhealthy	Purple	#7030A0
Hazardous	Maroon	#800000
Tech Stack

Frontend / Dashboard: Streamlit or React + Plotly/D3/Recharts

Backend / Data Utilities: Python (Pandas, NumPy, Scikit-learn)

Forecasting: Prophet, ARIMA, or LSTM

Advanced Charts: Plotly, Matplotlib, Altair

Export Functionality: fpdf2, reportlab

Installation & Run Instructions (Streamlit Version)
# Clone repository
git clone https://github.com/deekshitaa1/air-quality-dashboard.git
cd air-quality-dashboard

# Create environment (optional but recommended)
conda create -n aqi_dashboard python=3.11
conda activate aqi_dashboard

# Install dependencies
pip install -r requirements.txt

# Run dashboard
streamlit run app.py

Demo

Interactive Dashboard: Visualize AQI trends, forecast, and insights in real-time.

Export PDF: Download reports for analysis or portfolio showcase.

Portfolio Impact

Combines data analysis, forecasting, advanced visualizations, AI insights, and UX design.

Ideal for demonstrating data analytics, product engineering, and data storytelling skills.
