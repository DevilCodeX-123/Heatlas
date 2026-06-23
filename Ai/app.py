import streamlit as st
import pandas as pd
import geopandas as gpd
import folium
from streamlit_folium import st_folium
import rasterio
import sklearn

st.set_page_config(page_title="Heatlas AI Dashboard", layout="wide")

st.title("Heatlas AI Engine")
st.markdown("Welcome to the Heatlas AI geospatial analysis dashboard. Your libraries are successfully loaded!")

st.subheader("Environment Check")
col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric(label="Pandas Version", value=pd.__version__)
    st.metric(label="Geopandas Version", value=gpd.__version__)
with col2:
    st.metric(label="Rasterio Version", value=rasterio.__version__)
    st.metric(label="Scikit-Learn Version", value=sklearn.__version__)
with col3:
    st.metric(label="Streamlit Version", value=st.__version__)
    st.metric(label="Folium Version", value=folium.__version__)

st.divider()

st.subheader("Sample Interactive Map")
# Create a basic folium map centered on India
m = folium.Map(location=[20.5937, 78.9629], zoom_start=5)
# Call to render Folium map in Streamlit
st_data = st_folium(m, width=700, height=500)
