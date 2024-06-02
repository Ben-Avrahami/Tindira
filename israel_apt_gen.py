import random
import json
from faker import Faker
from decimal import Decimal

fake_he = Faker('he_IL')
fake_en = Faker()

# Sample listing to use as template
sample_listing = {
    "likedBy": ["user3"],
    "listingId": "listing27",
    "contractEndDate": "2024-07-14",
    "postExpireDate": "2024-07-01",
    "numberOfRooms": 4,
    "ownerId": "user6",
    "parking": 2,
    "contractStartingDate": "2024-07-01",
    "isActive": True,
    "isAnimalFriendly": False,
    "PricePerWholeTime": False,
    "category": "sublet",
    "images": [
        "https://tindira.s3.us-east-2.amazonaws.com/listings/listing3/image1.jpg",
        "https://tindira.s3.us-east-2.amazonaws.com/listings/listing3/image2.jpg",
        "https://tindira.s3.us-east-2.amazonaws.com/listings/listing3/image3.jpg",
        "https://tindira.s3.us-east-2.amazonaws.com/listings/listing3/image4.jpg",
        "https://tindira.s3.us-east-2.amazonaws.com/listings/listing3/image5.jpg"
    ],
    "contractLength": "1 year",
    "description": "An exquisite penthouse offering luxurious amenities and breathtaking views bluh bluh.",
    "price": 5000,
    "coordinates": {
        "formatted_address": "Hess St, Tel Aviv-Yafo, Israel",
        "geometry": {
            "location": {
                "lng": 34.7698472,
                "lat": 32.0728056
            }
        },
        "place_id": "EiJIZXNzIFN0cmVldCwgVGVsIEF2aXYtWWFmbywgSXJhZWwi4qLAoUChIJRyEC6YBMHRURn_y4KduY74wSFAoSCR98OxmmTB0VEZA_lsCicvvB"
    },
    "postUploadDate": "2024-04-03",
    "title": "Luxury Penthouse with Stunning Views bluh",
    "hasGarden": True,
    "hasPorch": False
}

# Function to handle Decimal serialization
def default_serializer(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError(f'Object of type {obj.__class__.__name__} is not JSON serializable')

# Generate random listings
def generate_listing(index):
    listing = sample_listing.copy()
    listing['likedBy'] = [f"user{random.randint(1, 100)}"]
    listing['listingId'] = f"listing{index}"
    listing['contractEndDate'] = fake_he.date_between(start_date='+1y', end_date='+2y').strftime('%Y-%m-%d')
    listing['postExpireDate'] = fake_he.date_between(start_date='now', end_date='+6m').strftime('%Y-%m-%d')
    listing['numberOfRooms'] = random.randint(1, 6)
    listing['ownerId'] = f"user{random.randint(1, 100)}"
    listing['parking'] = random.randint(0, 3)
    listing['contractStartingDate'] = fake_he.date_between(start_date='now', end_date='+6m').strftime('%Y-%m-%d')
    listing['isActive'] = random.choice([True, False])
    listing['isAnimalFriendly'] = random.choice([True, False])
    listing['PricePerWholeTime'] = random.choice([True, False])
    listing['category'] = random.choice(["sublet", "rent"])
    listing['price'] = random.randint(2000, 10000)
    listing['coordinates']['formatted_address'] = fake_he.address().replace("\n", ", ")
    listing['coordinates']['geometry']['location']['lng'] = float(fake_he.longitude())
    listing['coordinates']['geometry']['location']['lat'] = float(fake_he.latitude())
    listing['postUploadDate'] = fake_he.date_between(start_date='-1y', end_date='now').strftime('%Y-%m-%d')
    listing['title'] = fake_en.sentence(nb_words=6)
    listing['hasGarden'] = random.choice([True, False])
    listing['hasPorch'] = random.choice([True, False])
    return listing

listings = [generate_listing(i) for i in range(28, 228)]  # Generate 200 listings starting from 28

# Convert to JSON
json_output = json.dumps(listings, indent=4, default=default_serializer)

# Save to file (optional)
with open('listings.json', 'w') as f:
    f.write(json_output)

print(json_output)
