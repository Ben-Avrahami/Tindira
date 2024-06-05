import boto3
import json
from decimal import Decimal

def upload_listings_to_dynamodb(file_path, table_name, region_name='us-east-2'):
    # Create a DynamoDB resource
    dynamodb = boto3.resource('dynamodb', region_name=region_name)

    # Load JSON data from file
    with open(file_path, 'r') as file:
        listings = json.load(file, parse_float=Decimal)

    # Get DynamoDB table
    table = dynamodb.Table(table_name)

    # Upload each listing to DynamoDB
    for listing in listings:
        table.put_item(Item=listing)

    print("Listings uploaded to DynamoDB table successfully.")

if __name__ == "__main__":
    # File path and table name
    file_path = "C:\\Users\\galbenar\\OneDrive - Intel Corporation\\Desktop\\Work\\clones\\CloudNetWorkshopUni\\Tindira-Server\\datebase\\listings.json"
    table_name = "TindiraListings"

    # Upload listings to DynamoDB table
    upload_listings_to_dynamodb(file_path, table_name)
