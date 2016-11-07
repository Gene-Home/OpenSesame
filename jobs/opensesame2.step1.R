##### Step 1

# Load script to allow translation of input to Entrez Gene IDs
source("/projectnb/ctsi/openSESAME/R/translate_identifiers.R");

# Parse the input from the strings obtained from the dialog boxes
diagnostic <- translate.signature(
    up.string   = readChar("upgenes", file.info("upgenes")$size),
    down.string = readChar("downgenes", file.info("downgenes")$size)
);

# Write the diagnostic output to a one-line text file
diagnostic.string <- with(diagnostic,
    paste(
        paste("Name type:", id.type),
        paste("Species:", species),
        paste("Up genes:", up.total, "input.", up.kept, "kept.", up.kept.unique, "unique."), 
        paste("Down genes:", down.total, "input.", down.kept, "kept.", down.kept.unique, "unique."),
        sep=" | "
    )
);
write(diagnostic.string, file="validation");

# Write the validated gene lists to a GMT file
cat(
    c("up", NA_character_, paste(diagnostic$up.probesets, collapse="\t")),
    c("down", NA_character_, paste(diagnostic$down.probesets, collapse="\t")),
    file="signature.gmt",
    sep="\n"
);
