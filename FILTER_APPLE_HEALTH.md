# Filter Large Apple Health Export Files (3GB+ Files!)

Your Apple Health `export.html` file is **3GB**? That's normal! Use this script to shrink it to ~10MB.

## Quick Start - Python Script (Recommended)

### Step 1: Install Python
Make sure Python 3 is installed: https://www.python.org/downloads/

### Step 2: Create the Script
Save this as `filter_health_data.py` in the **same folder** as your `export.html`:

```python
from datetime import datetime, timedelta
import sys
import re
import os

def filter_apple_health_html(input_file, output_file, days_back=90):
    """
    Filter 3GB Apple Health HTML files to just the last N days.
    Reduces file from 3GB to ~10MB!
    """
    print(f"📱 Loading {input_file}...")
    print(f"   Original size: {os.path.getsize(input_file) / (1024*1024*1024):.2f} GB")
    print(f"   This may take 1-2 minutes for large files...")
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Calculate cutoff date
    cutoff_date = datetime.now() - timedelta(days=days_back)
    cutoff_str = cutoff_date.strftime('%Y-%m-%d')
    
    print(f"\n✂️  Filtering to keep data from {cutoff_str} onwards...")
    
    # Split into lines and filter
    lines = content.split('\n')
    filtered_lines = []
    records_kept = 0
    records_removed = 0
    
    for line in lines:
        # Check if line contains a date in YYYY-MM-DD format
        date_match = re.search(r'(\d{4}-\d{2}-\d{2})', line)
        
        if date_match:
            date_str = date_match.group(1)
            if date_str >= cutoff_str:
                filtered_lines.append(line)
                records_kept += 1
            else:
                records_removed += 1
        else:
            # Keep non-data rows (HTML structure, headers, etc.)
            filtered_lines.append(line)
    
    print(f"   ✅ Kept: {records_kept:,} records")
    print(f"   🗑️  Removed: {records_removed:,} old records")
    
    # Write filtered content
    print(f"\n💾 Saving to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(filtered_lines))
    
    # Show results
    filtered_size_mb = os.path.getsize(output_file) / (1024 * 1024)
    original_size_gb = os.path.getsize(input_file) / (1024 * 1024 * 1024)
    
    print(f"\n🎉 Done!")
    print(f"   Original: {original_size_gb:.2f} GB")
    print(f"   Filtered: {filtered_size_mb:.2f} MB")
    print(f"   Reduction: {(1 - (filtered_size_mb / (original_size_gb * 1024))) * 100:.1f}%")
    print(f"\n📤 Now upload '{output_file}' to your health tracker!")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("=" * 70)
        print("🍎 Apple Health Data Filter - Shrink 3GB Files to ~10MB!")
        print("=" * 70)
        print("\n📖 Usage:")
        print("   python filter_health_data.py export.html [days]")
        print("\n📝 Examples:")
        print("   python filter_health_data.py export.html 30   # Last 30 days (~5 MB)")
        print("   python filter_health_data.py export.html 90   # Last 90 days (~10 MB)")
        print("   python filter_health_data.py export.html 180  # Last 6 months (~15 MB)")
        print("\n💡 Tip: Start with 30 days first to get a small file!")
        print("=" * 70)
        sys.exit(1)
    
    input_file = sys.argv[1]
    days_back = int(sys.argv[2]) if len(sys.argv) > 2 else 90
    
    if not os.path.exists(input_file):
        print(f"❌ Error: File '{input_file}' not found!")
        print(f"   Make sure you're in the apple_health_export folder")
        print(f"   Current directory: {os.getcwd()}")
        sys.exit(1)
    
    # Create output filename
    base_name = os.path.splitext(input_file)[0]
    extension = os.path.splitext(input_file)[1]
    output_file = f"{base_name}_last_{days_back}_days{extension}"
    
    filter_apple_health_html(input_file, output_file, days_back)
```

### Step 3: Run It!

**In Terminal/Command Prompt:**
```bash
# Navigate to your apple_health_export folder
cd ~/Downloads/apple_health_export

# Run the filter (last 90 days recommended)
python filter_health_data.py export.html 90

# Upload the resulting file: export_last_90_days.html
```

**This will shrink your 3GB file to ~10MB!** 

---

## Why So Large?

Apple Health HTML files include:
- Every heart rate measurement (could be millions!)
- Every step count
- Every workout detail
- Years of historical data

Filtering to 90 days gives you plenty of recent data in a tiny file.

---

## Recommended Settings

- **30 days**: ~3-5 MB (fastest import, recent trends)
- **90 days**: ~8-12 MB (good balance)  ⭐ **Recommended**
- **180 days**: ~15-18 MB (6 months history)

Start with 30 days if you want the smallest file!
