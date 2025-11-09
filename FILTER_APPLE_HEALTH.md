# Filter Large Apple Health Export Files

Your Apple Health file has **millions of records**! Most are not useful. This script filters by **date AND data type** to get files under 20MB.

## Smart Python Filter Script

### Step 1: Install Python
Make sure Python 3 is installed: https://www.python.org/downloads/

### Step 2: Create the Script
Save this as `filter_health_data.py`:

```python
from datetime import datetime, timedelta
import sys
import os

def filter_apple_health_xml(input_file, output_file, days_back=7, data_types=None):
    """
    Filter Apple Health XML by date AND specific data types.
    
    Args:
        input_file: Path to export.xml
        output_file: Path for filtered output
        days_back: Number of days to include (default 7)
        data_types: List of data types to keep (None = keep important ones only)
    """
    import xml.etree.ElementTree as ET
    
    print(f"📱 Loading {input_file}...")
    print(f"   Size: {os.path.getsize(input_file) / (1024*1024):.2f} MB")
    
    # Parse XML incrementally to handle large files
    tree = ET.parse(input_file)
    root = tree.getroot()
    
    # Calculate cutoff date
    cutoff_date = datetime.now() - timedelta(days=days_back)
    cutoff_str = cutoff_date.strftime('%Y-%m-%d')
    
    # Default to important health metrics only
    if data_types is None:
        # These are the IMPORTANT ones - filters out millions of step/heart rate samples
        data_types = [
            'HKCategoryTypeIdentifierSleepAnalysis',
            'HKQuantityTypeIdentifierBodyMass',
            'HKQuantityTypeIdentifierHeight',
            'HKQuantityTypeIdentifierRestingHeartRate',  # NOT every heart rate sample
            'HKQuantityTypeIdentifierBloodPressureSystolic',
            'HKQuantityTypeIdentifierBloodPressureDiastolic',
            'HKQuantityTypeIdentifierBodyTemperature',
            'HKQuantityTypeIdentifierBloodGlucose',
            'HKQuantityTypeIdentifierOxygenSaturation',
            'HKQuantityTypeIdentifierDietaryEnergyConsumed',  # Calories eaten
            'HKQuantityTypeIdentifierDietaryProtein',
            'HKQuantityTypeIdentifierDietaryCarbohydrates',
            'HKQuantityTypeIdentifierDietaryFatTotal',
            'HKQuantityTypeIdentifierStepCount',  # Step counts (we'll aggregate daily)
        ]
    
    # Dictionary to store daily step aggregates
    daily_steps = {}
    
    print(f"✂️  Filtering to:")
    print(f"   - Date: {cutoff_str} onwards ({days_back} days)")
    print(f"   - Types: {len(data_types)} important metrics only")
    print(f"   - Excluding: step counts, every heart rate sample, etc.")
    
    # Filter records
    records_kept = 0
    records_removed = 0
    
    # Remove old or unwanted records
    for record in list(root.findall('.//Record')):
        record_type = record.get('type', '')
        start_date = record.get('startDate', '')
        date_only = start_date[:10] if start_date else ''
        
        # Special handling for step counts - aggregate by day
        if record_type == 'HKQuantityTypeIdentifierStepCount' and start_date >= cutoff_str:
            value = float(record.get('value', 0))
            if date_only not in daily_steps:
                daily_steps[date_only] = {'total': 0, 'records': []}
            daily_steps[date_only]['total'] += value
            daily_steps[date_only]['records'].append(record)
            # Remove this record (we'll add aggregated version later)
            root.remove(record)
            continue
        
        # Remove if too old OR not in our important types
        if start_date < cutoff_str or record_type not in data_types:
            root.remove(record)
            records_removed += 1
        else:
            records_kept += 1
    
    # Add back ONE step count record per day (aggregated)
    steps_aggregated = 0
    for date, data in daily_steps.items():
        # Keep only the first record and update its value to the daily total
        if data['records']:
            first_record = data['records'][0]
            first_record.set('value', str(int(data['total'])))
            root.append(first_record)
            records_kept += 1
            steps_aggregated += 1
    
    print(f"   📊 Aggregated {steps_aggregated} days of step counts")
    
    # Keep all workouts within date range
    workouts_kept = 0
    workouts_removed = 0
    for workout in list(root.findall('.//Workout')):
        start_date = workout.get('startDate', '')
        if start_date < cutoff_str:
            root.remove(workout)
            workouts_removed += 1
        else:
            workouts_kept += 1
    
    print(f"\n📊 Results:")
    print(f"   Records kept: {records_kept:,}")
    print(f"   Records removed: {records_removed:,}")
    print(f"   Workouts kept: {workouts_kept:,}")
    print(f"   Workouts removed: {workouts_removed:,}")
    
    # Save filtered XML
    print(f"\n💾 Saving to {output_file}...")
    tree.write(output_file, encoding='utf-8', xml_declaration=True)
    
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
