import random
import json
from faker import Faker
from decimal import Decimal
import googlemaps

# Initialize Faker and Google Maps client
fake_he = Faker('he_IL')
fake_en = Faker()
gmaps = googlemaps.Client(key='AIzaSyB59Go2THLVYF9dAAekVCKc-41PWaWabAM')  # Replace with your Google Maps API key

# Sample listing to use as template
sample_listing = {
    "likedBy": ["user3"],
    "listingId": "listing100",  # Start from listing100
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
    "description": "An exquisite penthouse offering luxurious amenities and breathtaking views.",
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
    "title": "Luxury Penthouse with Stunning Views",
    "hasGarden": True,
    "hasPorch": False
}

# Function to handle Decimal serialization
def default_serializer(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError(f'Object of type {obj.__class__.__name__} is not JSON serializable')

# Function to get a random address in Tel Aviv, Israel using Google Maps API
def get_random_tel_aviv_address():
    while True:
        lat = random.uniform(32.0504, 32.1204)  # Tel Aviv's approximate latitude range
        lng = random.uniform(34.7501, 34.8303)  # Tel Aviv's approximate longitude range
        reverse_geocode_result = gmaps.reverse_geocode((lat, lng))
        if reverse_geocode_result:
            for component in reverse_geocode_result[0]['address_components']:
                if 'route' in component['types']:
                    street = component['long_name']
                if 'locality' in component['types']:
                    city = component['long_name']
            formatted_address = f"{street}, {city}"
            if 'Tel Aviv-Yafo' in formatted_address:
                return {
                    "formatted_address": formatted_address,
                    "geometry": reverse_geocode_result[0]['geometry'],
                    "place_id": reverse_geocode_result[0]['place_id']
                }

# Function to generate random apartment titles
def generate_apartment_title():
    titles = [
        "Spacious 2-Bedroom Apartment",
        "Cozy Studio in the City Center",
        "Modern Loft with Great View",
        "Charming 3-Bedroom Apartment",
        "Luxurious Penthouse with Sea View",
        "Affordable 1-Bedroom Flat",
        "Renovated 4-Bedroom Apartment",
        "Bright and Airy 2-Bedroom",
        "Stylish Apartment in Prime Location",
        "Comfortable Family Home",
        "Elegant 3-Bedroom Apartment",
        "Compact Studio Near Beach",
        "Exclusive Duplex with Balcony",
        "Quiet Suburban Flat",
        "City Living at its Best",
        "Garden Apartment with Pool Access",
        "Newly Built Modern Apartment",
        "Historic Charm with Modern Amenities",
        "High-Rise Apartment with Parking",
        "Penthouse with Rooftop Terrace"
    ]
    return random.choice(titles)

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

    address_info = get_random_tel_aviv_address()
    listing['coordinates']['formatted_address'] = address_info['formatted_address']
    listing['coordinates']['geometry']['location']['lng'] = address_info['geometry']['location']['lng']
    listing['coordinates']['geometry']['location']['lat'] = address_info['geometry']['location']['lat']
    listing['coordinates']['place_id'] = address_info['place_id']

    listing['postUploadDate'] = fake_he.date_between(start_date='-1y', end_date='now').strftime('%Y-%m-%d')
    listing['title'] = generate_apartment_title()
    listing['hasGarden'] = random.choice([True, False])
    listing['hasPorch'] = random.choice([True, False])
    return listing

listings = [generate_listing(i) for i in range(100, 105)]  # Generate 5 listings starting from 100

# Convert to JSON
json_output = json.dumps(listings, indent=4, default=default_serializer)

# Save to file (optional)
with open('listings.json', 'w') as f:
    f.write(json_output)

print(json_output)
