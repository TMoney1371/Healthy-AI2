# Filter Large Apple Health Export Files

If your Apple Health export.xml file is too large (over 20MB), use this Python script to filter it by date range.

## Option 1: Python Script (Easiest)

### Step 1: Install Python
Make sure you have Python 3 installed on your computer.

### Step 2: Create the Script
Save this as `filter_health_data.py`:

```python
import xml.etree.ElementTree as ET
from datetime import datetime
import sys

def filter_apple_health_xml(input_file, output_file, days_back=90):
    """
    Filter Apple Health XML to only include data from the last N days.
    
    Args:
        input_file: Path to the original export.xml file
        output_file: Path where the filtered XML will be saved
        days_back: Number of days to include (default 90)
    """
    print(f"Loading {input_file}...")
    tree = ET.parse(input_file)
    root = tree.getroot()
    
    # Calculate cutoff date
    from datetime import timedelta
    cutoff_date = datetime.now() - timedelta(days=days_back)
    cutoff_str = cutoff_date.strftime('%Y-%m-%d')
    
    print(f"Filtering data from {cutoff_str} onwards...")
    
    # Filter records
    records_removed = 0
    workouts_removed = 0
    
    for record in root.findall('.//Record'):
        start_date = record.get('startDate', '')
        if start_date < cutoff_str:
            root.remove(record)
            records_removed += 1
    
    for workout in root.findall('.//Workout'):
        start_date = workout.get('startDate', '')
        if start_date < cutoff_str:
            root.remove(workout)
            workouts_removed += 1
    
    print(f"Removed {records_removed} old records and {workouts_removed} old workouts")
    
    # Save filtered XML
    print(f"Saving filtered data to {output_file}...")
    tree.write(output_file, encoding='utf-8', xml_declaration=True)
    
    # Get file sizes
    import os
    original_size = os.path.getsize(input_file) / (1024 * 1024)  # MB
    filtered_size = os.path.getsize(output_file) / (1024 * 1024)  # MB
    
    print(f"\nDone!")
    print(f"Original file: {original_size:.2f} MB")
    print(f"Filtered file: {filtered_size:.2f} MB")
    print(f"Reduction: {((original_size - filtered_size) / original_size * 100):.1f}%")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python filter_health_data.py export.xml [days_back]")
        print("Example: python filter_health_data.py export.xml 90")
        print("\nThis will create export_filtered.xml with data from the last 90 days")
        sys.exit(1)
    
    input_file = sys.argv[1]
    days_back = int(sys.argv[2]) if len(sys.argv) > 2 else 90
    output_file = input_file.replace('.xml', '_filtered.xml')
    
    filter_apple_health_xml(input_file, output_file, days_back)
```

### Step 3: Run the Script
```bash
# Filter to last 30 days
python filter_health_data.py export.xml 30

# Filter to last 90 days (default)
python filter_health_data.py export.xml 90

# Filter to last 180 days
python filter_health_data.py export.xml 180
```

This creates `export_filtered.xml` which should be much smaller!

---

## Option 2: Manual Text Editing (No Programming)

### Using TextEdit (Mac) or Notepad++ (Windows):

1. **Open export.xml** in a text editor
2. **Search for recent dates** (e.g., search for "2025-" or "2024-")
3. **Copy the XML header** (first ~10 lines until `<HealthData>`)
4. **Copy only recent records** you want to keep
5. **Add the closing tag** `</HealthData>` at the end
6. **Save as new file** (e.g., `export_recent.xml`)

---

## Option 3: Online XML Splitter

Use **xmlgrid.net** or **codebeautify.org/xmlviewer**:
1. Upload your export.xml
2. Filter/search by date attributes
3. Export only matching records
4. Download the filtered XML

---

## Option 4: Request Upload Limit Increase

Contact us through the app settings to request a higher upload limit for your account. We can increase it to 100MB or 500MB if needed.

---

## Recommended Date Ranges

- **Last 30 days**: Quick import, recent data only (~1-5 MB)
- **Last 90 days**: Good balance of data and size (~5-10 MB)
- **Last 180 days**: 6 months of history (~10-15 MB)
- **Last 365 days**: Full year (~15-20 MB)

After filtering, upload the new XML file to the app!
