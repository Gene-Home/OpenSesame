##### Step 2

# This code produces output in the same format as that produced by
# the original openSESAME() function from the openSESAME.server package

# Load openSESAME package
library(openSESAME);

# Run algorithm
result <- openSESAME(
    signature.filename = "signature.gmt",
    heatmap.filename = "out_heatmaps.pdf",
    verbose = TRUE
);

# Create a data frame of output in same format as previous package
series.table <- data.frame(
    "Series ID"    = result$sets$id,
    "Series Title" = result$sets$title,
    "KS p"         = NA,
    "KS q"         = NA,
    "Fisher p"     = result$sets[["Fisher p"]],
    "Fisher q"     = result$sets[["Fisher FDR q"]],
    check.names = FALSE,
    stringsAsFactors = FALSE
);
# Sort the table by Fisher p values
series.table <- series.table[order(series.table[["Fisher p"]]), ];
# Reformat the p and q values to look nicer
series.table[, c("Fisher p", "Fisher q")] <- lapply(series.table[, c("Fisher p", "Fisher q")], sapply, format, digits=3);
# Write the table to a tab-delimited file
write.table(series.table, "out_series_table.txt", quote=FALSE, sep="\t", row.names=FALSE, col.names=TRUE);

# return code from original openSESAME() function
0L
