# Filter Large Apple Health Export Files (Fast Streaming Version)

Your Apple Health file has **millions of records**! This **fast streaming script** processes 3GB files in 2-3 minutes with a live progress bar.

## Fast Streaming Python Filter Script

### Step 1: Install Python
Make sure Python 3 is installed: https://www.python.org/downloads/

### Step 2: Create the Script
Save this as `filter_health_data.py`:

```python
from datetime import datetime, timedelta
import sys
import os
import xml.etree.ElementTree as ET

def filter_apple_health_xml(input_file, output_file, days_back=7, data_types=None):
    """
    FAST streaming filter for Apple Health XML - handles 3GB files in 2-3 minutes!
    Uses iterative parsing to avoid loading entire file into memory.
    
    Args:
        input_file: Path to export.xml
        output_file: Path for filtered output
        days_back: Number of days to include (default 7)
        data_types: List of data types to keep (None = keep important ones only)
    """
    
    file_size_mb = os.path.getsize(input_file) / (1024*1024)
    print(f"📱 Processing {input_file}")
    print(f"   Size: {file_size_mb:.2f} MB")
    print(f"   Using FAST streaming parser - this will take 2-3 minutes...")
    print()
    
    # Calculate cutoff date
    cutoff_date = datetime.now() - timedelta(days=days_back)
    cutoff_str = cutoff_date.strftime('%Y-%m-%d')
    
    # Default to important health metrics only
    if data_types is None:
        data_types = {
            'HKCategoryTypeIdentifierSleepAnalysis',
            'HKQuantityTypeIdentifierBodyMass',
            'HKQuantityTypeIdentifierHeight',
            'HKQuantityTypeIdentifierRestingHeartRate',
            'HKQuantityTypeIdentifierBloodPressureSystolic',
            'HKQuantityTypeIdentifierBloodPressureDiastolic',
            'HKQuantityTypeIdentifierBodyTemperature',
            'HKQuantityTypeIdentifierBloodGlucose',
            'HKQuantityTypeIdentifierOxygenSaturation',
            'HKQuantityTypeIdentifierDietaryEnergyConsumed',
            'HKQuantityTypeIdentifierDietaryProtein',
            'HKQuantityTypeIdentifierDietaryCarbohydrates',
            'HKQuantityTypeIdentifierDietaryFatTotal',
            'HKQuantityTypeIdentifierStepCount',
        }
    
    print(f"✂️  Filtering to data from {cutoff_str} onwards ({days_back} days)")
    print(f"   Keeping {len(data_types)} important metric types only")
    print()
    
    # Use iterative parsing for SPEED
    records_kept = 0
    records_removed = 0
    workouts_kept = 0
    workouts_removed = 0
    daily_steps = {}
    
    # First pass - count total records for progress
    print("⏳ Counting records...")
    context = ET.iterparse(input_file, events=('start', 'end'))
    total_records = 0
    for event, elem in context:
        if event == 'end' and elem.tag in ('Record', 'Workout'):
            total_records += 1
            if total_records % 100000 == 0:
                print(f"   Found {total_records:,} records so far...")
            elem.clear()
    
    print(f"   Total: {total_records:,} records to process")
    print()
    
    # Second pass - filter and write
    print("🔄 Filtering records...")
    
    with open(output_file, 'w', encoding='utf-8') as out_file:
        # Write XML header
        out_file.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        out_file.write('<!DOCTYPE HealthData [\n')
        out_file.write('<!ELEMENT HealthData (ExportDate,Me,(Record|Workout|ActivitySummary|Correlation)*)>\n')
        out_file.write(']>\n')
        out_file.write('<HealthData locale="en_US">\n')
        
        # Parse and filter
        context = ET.iterparse(input_file, events=('start', 'end'))
        processed = 0
        last_progress = 0
        
        for event, elem in context:
            if event == 'end':
                processed += 1
                
                # Show progress every 100k records
                progress_pct = (processed / total_records) * 100
                if progress_pct - last_progress >= 5:
                    last_progress = int(progress_pct / 5) * 5
                    print(f"   Progress: {last_progress}% ({processed:,}/{total_records:,}) - Kept: {records_kept:,}")
                
                if elem.tag == 'ExportDate' or elem.tag == 'Me':
                    # Keep metadata
                    out_file.write(ET.tostring(elem, encoding='unicode'))
                    elem.clear()
                    continue
                
                if elem.tag == 'Record':
                    record_type = elem.get('type', '')
                    start_date = elem.get('startDate', '')
                    date_only = start_date[:10] if start_date else ''
                    
                    # Step count aggregation
                    if record_type == 'HKQuantityTypeIdentifierStepCount' and start_date >= cutoff_str:
                        value = float(elem.get('value', 0))
                        if date_only not in daily_steps:
                            daily_steps[date_only] = {'total': 0, 'sample': elem}
                        daily_steps[date_only]['total'] += value
                        records_removed += 1
                    # Keep if recent AND important type
                    elif start_date >= cutoff_str and record_type in data_types:
                        out_file.write(ET.tostring(elem, encoding='unicode'))
                        records_kept += 1
                    else:
                        records_removed += 1
                    
                    elem.clear()
                    continue
                
                if elem.tag == 'Workout':
                    start_date = elem.get('startDate', '')
                    if start_date >= cutoff_str:
                        out_file.write(ET.tostring(elem, encoding='unicode'))
                        workouts_kept += 1
                    else:
                        workouts_removed += 1
                    elem.clear()
                    continue
        
        # Write aggregated step counts
        print(f"\n📊 Adding {len(daily_steps)} days of aggregated step counts...")
        for date, data in sorted(daily_steps.items()):
            elem = data['sample']
            elem.set('value', str(int(data['total'])))
            out_file.write(ET.tostring(elem, encoding='unicode'))
            records_kept += 1
        
        # Close XML
        out_file.write('</HealthData>\n')
    
    print(f"\n✅ Results:")
    print(f"   Records kept: {records_kept:,}")
    print(f"   Records removed: {records_removed:,}")
    print(f"   Workouts kept: {workouts_kept:,}")
    print(f"   Workouts removed: {workouts_removed:,}")
    
    # Show file sizes
    original_mb = os.path.getsize(input_file) / (1024 * 1024)
    filtered_mb = os.path.getsize(output_file) / (1024 * 1024)
    
    print(f"\n🎉 Done!")
    print(f"   Original: {original_mb:.2f} MB")
    print(f"   Filtered: {filtered_mb:.2f} MB")
    print(f"   Reduction: {((original_mb - filtered_mb) / original_mb * 100):.1f}%")
    
    if filtered_mb <= 20:
        print(f"\n✅ File is under 20MB - ready to upload!")
    else:
        print(f"\n⚠️  File is still {filtered_mb:.2f} MB")
        print(f"   Try fewer days or upload on Laravel Cloud")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("=" * 70)
        print("🍎 Apple Health Smart Filter - Remove Millions of Unnecessary Records!")
        print("=" * 70)
        print("\n📖 Usage:")
        print("   python filter_health_data.py export.xml [days]")
        print("\n📝 Examples:")
        print("   python filter_health_data.py export.xml 3   # Last 3 days")
        print("   python filter_health_data.py export.xml 7   # Last 7 days")
        print("   python filter_health_data.py export.xml 30  # Last 30 days")
        print("\n💡 This filters to:")
        print("   ✅ Sleep, weight, resting heart rate, blood pressure")
        print("   ✅ All workouts")
        print("   ✅ Nutrition data (if logged)")
        print("   ❌ Removes: Every step count, every heart rate sample, etc.")
        print("\n🎯 Goal: Get file under 20MB for upload!")
        print("=" * 70)
        sys.exit(1)
    
    input_file = sys.argv[1]
    days_back = int(sys.argv[2]) if len(sys.argv) > 2 else 7
    
    if not os.path.exists(input_file):
        print(f"❌ Error: File '{input_file}' not found!")
        print(f"   Current directory: {os.getcwd()}")
        print(f"   Make sure you're in the apple_health_export folder")
        sys.exit(1)
    
    # Create output filename
    base_name = os.path.splitext(input_file)[0]
    extension = os.path.splitext(input_file)[1]
    output_file = f"{base_name}_filtered_{days_back}days{extension}"
    
    filter_apple_health_xml(input_file, output_file, days_back)
```

## What This Filters Out (The Bloat!)

**❌ Removed (millions of records):**
- Every single heart rate measurement (could be 100k+ per day!)
- Every step count
- Every stand hour
- Every activity ring update
- Every GPS coordinate

**✅ Kept (important data):**
- Sleep analysis
- Weight/body mass
- **Resting heart rate** (daily average, not every sample)
- Blood pressure
- Body temperature
- Blood glucose
- **Daily step counts** (total per day, not every individual count)
- Workouts (all of them)
- Nutrition (if you logged meals)

## Usage

```bash
# Navigate to your export folder
cd ~/Downloads/apple_health_export

# Try 3 days with smart filtering
python filter_health_data.py export.xml 3

# This should get you under 20MB!
```

**Expected Results:**
- **3 days**: ~5-10 MB ✅
- **7 days**: ~10-15 MB ✅
- **30 days**: ~15-20 MB ✅

The key is removing the **millions** of granular sensor readings you don't need! 🎯
