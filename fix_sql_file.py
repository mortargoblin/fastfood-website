import sys
import os

def fix_sql_file(input_file, target_collation="utf8mb4_unicode_ci"):
    if not os.path.exists(input_file):
        print(f"Error: File '{input_file}' does not exist.")
        return

    name, ext = os.path.splitext(input_file)
    output_file = f"{name}_fixed{ext}"

    with open(input_file, "r", encoding="utf-8") as f:
        content = f.read()

    content = content.replace("utf8mb4_uca1400_ai_ci", target_collation)

    content = content.replace(
        "SET NAMES utf8mb4;",
        f"SET NAMES utf8mb4 COLLATE {target_collation};"
    )

    with open(output_file, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"✅ Fixed SQL file written to: {output_file}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python fix_sql_collation.py input.sql")
        sys.exit(1)

    input_file = sys.argv[1]
    fix_sql_file(input_file)
