import os

# Base directory name
base_name = "listing"

# Start and end numbers
start_num = 11
end_num = 100

# Loop to create directories
for i in range(start_num, end_num + 1):
    dir_name = f"{base_name}{i}"
    os.makedirs(dir_name, exist_ok=True)
    print(f"Created directory: {dir_name}")
