import os

def count_files_in_directory(directory_path, output_file):
    with open(output_file, 'w') as f:
        for root, dirs, files in os.walk(directory_path):
            file_count = len(files)
            f.write(f"{root} - {file_count}\n")

# Set the path to the directory you want to start from
root_directory = 'C:\\Users\\galbenar\\OneDrive - Intel Corporation\\Desktop\\Work\\clones\\CloudNetWorkshopUni\\Tindira-Server\\datebase\\Images\\Listings'
output_file = 'num_of_images.txt'

count_files_in_directory(root_directory, output_file)
