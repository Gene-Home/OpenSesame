# inputs:
# name (unused here, just a string for metadata tracking)
# upgenes (file, expected by step1.R)
# downgenes (file, expected by step1.R)

# outputs:
# validation (file, produced by step1.R)
# signature (file, produced by step1.R and used by step2.R)
# heatmapsPDF (file, produced by step2.R)
# tableTSV (file, produced by step2.R and used by to_json.py)
# tableJSON (file, produced by to_json.py

# helpers:
# step1.R (transforms upgenes and outgenes to signature)
# step2.R (runs algorithm on signature)
# to_json.py (transforms tableTSV from TSV to JSON)

R -q --no-save < step1.R
R -q --no-save < step2.R
# algorithm does its own output filenaming, so adjust
mv out_heatmaps.pdf heatmapsPDF
mv out_series_table.txt tableTSV

python to_json_sesame.py tableTSV tableJSON