import os

# ================= CONFIGURATION =================
OUTPUT_FILE = "tree.txt"

# Add file paths here to show them in the tree but HIDE their content in tree.txt.
# Paths should be relative to where you run the script.
IGNORE_CONTENT = [
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "tree.py",
    "tree.txt",
    ".gitignore",
    "next-env.d.ts",
    "Dockerfile",
    "README.md",
]

# Folders to completely hide from the tree (noise reduction)
IGNORE_DIRS = {
    ".git", 
    "node_modules", 
    ".next",          # Next.js build output
    "out",            # Static exports
    "coverage",       # Testing reports
    ".vscode", 
    ".idea", 
    "public",         # Optional: Hide if you have many images
    "dist",
    ".github",
    "k8s",
}
# =================================================

def generate_project_view(startpath):
    files_to_read = []

    # Open the file in write mode ('w') to overwrite it every time
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f_out:

        # Helper to log to both console and file (for the tree part)
        def log_tree(message):
            print(message)          # Print to console
            f_out.write(message + "\n") # Write to file

        # Helper to log only to file (for the content part)
        def log_content(message):
            f_out.write(message + "\n")

        # Print Root Name
        root_name = f"{os.path.basename(os.path.abspath(startpath))}/"
        log_tree(root_name)

        def walk(path, prefix=""):
            try:
                entries = sorted(os.listdir(path))
            except PermissionError:
                return

            entries = [e for e in entries if e not in IGNORE_DIRS and e != OUTPUT_FILE]

            for index, entry in enumerate(entries):
                full_path = os.path.join(path, entry)
                is_last = (index == len(entries) - 1)

                connector = "└── " if is_last else "├── "
                line = f"{prefix}{connector}{entry}"

                log_tree(line)

                if os.path.isdir(full_path):
                    extension = "    " if is_last else "│   "
                    walk(full_path, prefix + extension)
                else:
                    files_to_read.append(full_path)

        # 1. Generate the Tree (To Console AND File)
        walk(startpath)

        # Separator only for the file
        log_content("\n\n\n" + "="*40)
        log_content(" FILE CONTENTS ")
        log_content("="*40 + "\n\n\n")

        # 2. Dump Content (To File ONLY)
        for file_path in files_to_read:
            clean_path = os.path.relpath(file_path, startpath).replace("\\", "/")
            if clean_path.startswith("./"):
                clean_path = clean_path[2:]

            log_content(f"--- PATH: {clean_path} ---")

            if clean_path in IGNORE_CONTENT:
                log_content(">>> [CONTENT IGNORED BY CONFIG]")
            else:
                try:
                    with open(file_path, 'r', encoding='utf-8') as f_in:
                        content = f_in.read()
                        log_content(content)
                except Exception as e:
                    log_content(f"[Error reading file: {e}]")

            log_content("\n\n\n")

    print(f"\nTree printed above. Full content saved to: {OUTPUT_FILE}")

if __name__ == "__main__":
    generate_project_view(".")