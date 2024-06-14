import random
import json
from faker import Faker
from decimal import Decimal
from dateutil.relativedelta import relativedelta
from datetime import datetime, timedelta

# Initialize Faker
fake_he = Faker('he_IL')
fake_en = Faker()

# Provided addresses (add up to 40 addresses)
addresses = [
{"formatted_address":"Sderot Nordau 44, Tel Aviv-Jaffa, Israel","geometry":{"location":{"lat":32.0921746,"lng":34.7771813},"viewport":{"south":32.0908485197085,"west":34.77583521970849,"north":32.0935464802915,"east":34.77853318029149}},"place_id":"ChIJn_R_K4tLHRUResW0E7oowl0"},
{"formatted_address":"Ben Yehuda St, Tel Aviv-Yafo, 8989222, Israel","geometry":{"location":{"lat":32.084301,"lng":34.772136},"viewport":{"south":32.0829520197085,"west":34.7707870197085,"north":32.0856499802915,"east":34.7734849802915}},"place_id":"ChIJrbrPhENNHRURmvg61JEeTtA"},
{"formatted_address":"Shlomo HaMelekh St 4, Tel Aviv-Yafo, Israel","geometry":{"location":{"lat":32.0767329,"lng":34.7767408},"viewport":{"south":32.07537376970851,"west":34.7753480197085,"north":32.0780717302915,"east":34.77804598029149}},"place_id":"ChIJLWJp2IBLHRUR0UdwZnvPk90"},
{"formatted_address":"Dizengoff St 111, Tel Aviv-Yafo, Israel","geometry":{"location":{"lat":32.0804266,"lng":34.7736682},"viewport":{"south":32.07908116970849,"west":34.7724135697085,"north":32.08177913029149,"east":34.7751115302915}},"place_id":"ChIJPSmUhHhMHRURSrxS8gqoL3A"},
{"formatted_address":"Rothschild Blvd 34, Tel Aviv-Yafo, Israel","geometry":{"location":{"lat":32.0633615,"lng":34.7731575},"viewport":{"south":32.0620457697085,"west":34.7717943697085,"north":32.0647437302915,"east":34.7744923302915}},"place_id":"ChIJSb1MTJ1MHRURZ9uxGsgyg7k"},
{"formatted_address":"Allenby St 67, Tel Aviv-Yafo, Israel","geometry":{"location":{"lat":32.0679315,"lng":34.7711716},"viewport":{"south":32.0665705197085,"west":34.7697825697085,"north":32.06926848029149,"east":34.7724805302915}},"place_id":"ChIJvcGCtYNMHRURf4R4Csugedk"},
{"formatted_address":"Yehuda ha-Levi St 19, Tel Aviv-Yafo, Israel","geometry":{"location":{"lat":32.0615538,"lng":34.7698022},"viewport":{"south":32.06015206970849,"west":34.76846206970851,"north":32.06285003029149,"east":34.7711600302915}},"place_id":"ChIJjzFiaJxMHRUR_nnHhkWrr3w"},
{"formatted_address":"King George St 12, Tel Aviv-Yafo, Israel","geometry":{"location":{"lat":32.0708826,"lng":34.7722171},"viewport":{"south":32.0695523697085,"west":34.7708468697085,"north":32.0722503302915,"east":34.7735448302915}},"place_id":"ChIJc6ONsIFMHRUROQXg6lxI6gs"},
{"formatted_address":"Nahalat Binyamin St 53, Tel Aviv-Yafo, Israel","geometry":{"location":{"lat":32.0643924,"lng":34.7713246},"viewport":{"south":32.0630316197085,"west":34.7699352697085,"north":32.0657295802915,"east":34.7726332302915}},"place_id":"ChIJNeh5KoNMHRURCsIVBZUw8_o"},
{"formatted_address":"Frishman St 45, Tel Aviv-Yafo, Israel","geometry":{"location":{"lat":32.0798346,"lng":34.7747876},"viewport":{"south":32.0784225197085,"west":34.7734362197085,"north":32.0811204802915,"east":34.7761341802915}},"place_id":"ChIJW6R-b4dLHRURURbebTJLAJY"},
{"formatted_address":"Bograshov St 61, Tel Aviv-Yafo, Israel","geometry":{"location":{"lat":32.0755477,"lng":34.772683},"viewport":{"south":32.0741470697085,"west":34.7712944197085,"north":32.0768450302915,"east":34.7739923802915}},"place_id":"ChIJyWNuvX9MHRURaT2ylVkXubw"},
{"formatted_address":"Arlozorov St 88, Tel Aviv-Yafo, Israel","geometry":{"bounds":{"south":32.0852575,"west":34.780217,"north":32.0854995,"east":34.7804404},"location":{"lat":32.0853828,"lng":34.7803366},"viewport":{"south":32.0840850697085,"west":34.7789797197085,"north":32.0867830302915,"east":34.78167768029149}},"place_id":"ChIJUaQfuo5LHRUREDWomkK1MOs"},
{"formatted_address":"Shlomo Ibn Gabirol St 42, Tel Aviv-Yafo, Israel","geometry":{"location":{"lat":32.0767557,"lng":34.7815799},"viewport":{"south":32.0754046697085,"west":34.7802009197085,"north":32.0781026302915,"east":34.7828988802915}},"place_id":"ChIJVYWhb4RLHRUR7kNBV6O8esw"},
{"formatted_address":"HaYarkon St 112, Tel Aviv-Yafo, Israel","geometry":{"location":{"lat":32.08045,"lng":34.7685954},"viewport":{"south":32.0791202697085,"west":34.7671607697085,"north":32.0818182302915,"east":34.7698587302915}},"place_id":"ChIJlQDz_XtMHRURPBcXOhUFY0A"},
{"formatted_address":"Montefiore St 26, Tel Aviv-Yafo, Israel","geometry":{"location":{"lat":32.0651638,"lng":34.7718489},"viewport":{"south":32.0638503197085,"west":34.7704826697085,"north":32.0665482802915,"east":34.7731806302915}},"place_id":"ChIJ5bg33YJMHRURszBlbL5fskg"},
{"formatted_address":"Sheinkin St 19, Tel Aviv-Yafo, Israel","geometry":{"location":{"lat":32.0692907,"lng":34.7733878},"viewport":{"south":32.0679262197085,"west":34.7720333697085,"north":32.0706241802915,"east":34.77473133029149}},"place_id":"ChIJG4GK74FMHRUR4MnsTq5p_nw"},
{"formatted_address":"Florentin St 61, Tel Aviv-Yafo, Israel","geometry":{"location":{"lat":32.0561144,"lng":34.7726082},"viewport":{"south":32.0547179697085,"west":34.7712453197085,"north":32.0574159302915,"east":34.7739432802915}},"place_id":"EiZGbG9yZW50aW4gU3QgNjEsIFRlbCBBdml2LVlhZm8sIElzcmFlbCIwEi4KFAoSCZ-npLafTB0VEQpOuexwXxMqED0qFAoSCRPIID6fTB0VEUoJdxWl18j2"},
{"formatted_address":"HaRakevet St 44, Tel Aviv-Yafo, Israel","geometry":{"bounds":{"south":32.0611872,"west":34.7809056,"north":32.0613929,"east":34.7811495},"location":{"lat":32.0612891,"lng":34.7810286},"viewport":{"south":32.0599410697085,"west":34.77967856970849,"north":32.0626390302915,"east":34.78237653029149}},"place_id":"ChIJ3b9mNXtLHRUR97ZkKdOcweQ"},
{"formatted_address":"Levontin St 13, Tel Aviv-Yafo, Israel","geometry":{"bounds":{"south":32.0619018,"west":34.7752904,"north":32.0621354,"east":34.7755844},"location":{"lat":32.0620635,"lng":34.7753524},"viewport":{"south":32.0606462197085,"west":34.77408841970851,"north":32.0633441802915,"east":34.7767863802915}},"place_id":"ChIJh9fJuGJLHRURFxgHOj8Si2o"},
{"formatted_address":"Jabotinsky St, Ramat Gan, Israel","geometry":{"bounds":{"south":32.06558609999997,"west":34.84653110000001,"north":32.07519330000002,"east":34.8539728},"location":{"lat":32.0703288,"lng":34.850375},"viewport":{"south":32.06558609999997,"west":34.84653110000001,"north":32.07519330000002,"east":34.8539728}},"place_id":"EiNKYWJvdGluc2t5IFN0IDMwLCBSYW1hdCBHYW4sIElzcmFlbCIuKiwKFAoSCRlgqr4SSh0VEUx5d8QM1l_fEhQKEgmt5JTnhkwdFRFvUhfnPr8ALQ"},
{"formatted_address":"Ben Yehuda St 48, Jerusalem, Israel","geometry":{"location":{"lat":31.7809387,"lng":35.2144551},"viewport":{"south":31.7795188197085,"west":35.2131260197085,"north":31.7822167802915,"east":35.2158239802915}},"place_id":"EiNCZW4gWWVodWRhIFN0IDQ4LCBKZXJ1c2FsZW0sIElzcmFlbCIwEi4KFAoSCRcH-_sp1gIVEbQE185HvcCSEDAqFAoSCY8AaEHWKQMVEU1NX8vqd3u1"},
{"formatted_address":"Rothschild Blvd 45, Tel Aviv-Yafo, Israel","geometry":{"location":{"lat":32.0642414,"lng":34.7746166},"viewport":{"south":32.0628349697085,"west":34.7732916197085,"north":32.0655329302915,"east":34.7759895802915}},"place_id":"ChIJAQBQXH1LHRURwhJptIz3lNo"},
{"formatted_address":"Ahuza St 17, Ra'anana, Israel","geometry":{"location":{"lat":32.1776909,"lng":34.8866066},"viewport":{"south":32.1763922197085,"west":34.88527206970851,"north":32.1790901802915,"east":34.8879700302915}},"place_id":"ChIJY3Axf0A4HRURpNltF-KawBU"},
{"formatted_address":"Weizmann St 8, Kefar Sava, Israel","geometry":{"location":{"lat":32.1779805,"lng":34.8957918},"viewport":{"south":32.1767301197085,"west":34.8944760697085,"north":32.1794280802915,"east":34.8971740302915}},"place_id":"ChIJNU6KnEg4HRURn9jMSCQ0xyU"},
{"formatted_address":"Hillel St 16, Jerusalem, Israel","geometry":{"location":{"lat":31.78017109999999,"lng":35.2175977},"viewport":{"south":31.7788711197085,"west":35.21625476970849,"north":31.7815690802915,"east":35.21895273029149}},"place_id":"ChIJUxAgiNYpAxURojG5qDFbmFE"},
{"formatted_address":"Herzl St 21, Haifa, Israel","geometry":{"location":{"lat":32.81163710000001,"lng":34.9977715},"viewport":{"south":32.81025306970851,"west":34.9963611197085,"north":32.8129510302915,"east":34.9990590802915}},"place_id":"ChIJ5ZJsY0y6HRURJni_1Q3tmiI"},
{"formatted_address":"Moriah Ave 25, Haifa, Israel","geometry":{"location":{"lat":32.8003453,"lng":34.9848933},"viewport":{"south":32.7989229197085,"west":34.9833800697085,"north":32.8016208802915,"east":34.98607803029149}},"place_id":"ChIJfbvRwQe7HRURY_kwXcaJbnk"},
{"formatted_address":"Ha-Gome St 23, Kiryat Tiv'on, Israel","geometry":{"location":{"lat":32.6987849,"lng":35.1101948},"viewport":{"south":32.6973920697085,"west":35.1088787697085,"north":32.7000900302915,"east":35.1115767302915}},"place_id":"ChIJ42O1i2uuHRURY0skEgQsNuE"},
{"formatted_address":"Sderot Ben Gurion 45, Haifa, Israel","geometry":{"location":{"lat":32.8189396,"lng":34.9900684},"viewport":{"south":32.8176205697085,"west":34.9886491197085,"north":32.8203185302915,"east":34.9913470802915}},"place_id":"ChIJffsa77W7HRUR5774eR8kfy0"},
{"formatted_address":"Abba Khoushy Ave 58, Haifa, Israel","geometry":{"location":{"lat":32.7760798,"lng":35.0000041},"viewport":{"south":32.7747958697085,"west":34.9987254697085,"north":32.7774938302915,"east":35.0014234302915}},"place_id":"ChIJB4wWCd66HRURIamtm4RLQOQ"},
{"formatted_address":"HaNassi Blvd 127, Haifa, Israel","geometry":{"location":{"lat":32.8036642,"lng":34.9872685},"viewport":{"south":32.8023613697085,"west":34.9858394697085,"north":32.8050593302915,"east":34.9885374302915}},"place_id":"ChIJAzdpD6m7HRUR_pNelwIAWwI"},
{"formatted_address":"Sderot Ye'elim 20, Beersheba, Israel","geometry":{"location":{"lat":31.2502384,"lng":34.7803331},"viewport":{"south":31.2487683697085,"west":34.7787497697085,"north":31.2514663302915,"east":34.7814477302915}},"place_id":"ChIJpTsYsAxmAhURVT2D0kuTQbE"},
{"formatted_address":"Henrietta Szold St 6, Be'er Sheva, Israel","geometry":{"location":{"lat":31.2469821,"lng":34.8002064},"viewport":{"south":31.2456629197085,"west":34.7988460197085,"north":31.2483608802915,"east":34.8015439802915}},"place_id":"ChIJa_3t4EBmAhURGdDdk4SvqxA"},
{"formatted_address":"Shlomo ha-Melekh St 8, Be'er Sheva, Israel","geometry":{"bounds":{"south":31.2606808,"west":34.79638,"north":31.2608286,"east":34.7965388},"location":{"lat":31.2607547,"lng":34.7964595},"viewport":{"south":31.2594057197085,"west":34.7951498697085,"north":31.2621036802915,"east":34.7978478302915}},"place_id":"ChIJeUxk_l1mAhURpB25DNwJuso"},
{"formatted_address":"Derekh Yotam 8, Eilat, Israel","geometry":{"location":{"lat":29.5526314,"lng":34.9503219},"viewport":{"south":29.5513056697085,"west":34.9489973697085,"north":29.5540036302915,"east":34.9516953302915}},"place_id":"ChIJ9REIXh1yABURUnd9NthgUuA"},
{"formatted_address":"Tarshish St 17, Eilat, Israel","geometry":{"bounds":{"south":29.5527187,"west":34.9569667,"north":29.55293619999999,"east":34.9571313},"location":{"lat":29.5528383,"lng":34.9570545},"viewport":{"south":29.5515565197085,"west":34.9557557197085,"north":29.5542544802915,"east":34.9584536802915}},"place_id":"ChIJQYHUFvpxABURBnQjfxk73gA"},
{"formatted_address":"Sderot HaTmarim 34, Eilat, Israel","geometry":{"location":{"lat":29.55920099999999,"lng":34.9513017},"viewport":{"south":29.55784706970849,"west":34.94985206970851,"north":29.56054503029149,"east":34.9525500302915}},"place_id":"ChIJyTOv96hxABURArsd0DV76AM"},
{"formatted_address":"Almogim St 3, Eilat, Israel","geometry":{"location":{"lat":29.5592078,"lng":34.9514465},"viewport":{"south":29.5578044697085,"west":34.9500996197085,"north":29.5605024302915,"east":34.9527975802915}},"place_id":"EhtBbG1vZ2ltIFN0IDMsIEVpbGF0LCBJc3JhZWwiMBIuChQKEgkfmtBH_3EAFRGkUGm6n8yG1xADKhQKEgl3DPgh_3EAFRHpbaPAxonf-A"},
{"formatted_address":"HaCarmel St 4, Yokne'am Illit, Israel","geometry":{"location":{"lat":32.6623824,"lng":35.10445199999999},"viewport":{"south":32.6610334197085,"west":35.10310301970849,"north":32.6637313802915,"east":35.10580098029149}},"place_id":"EivXlNeb16jXntecIDQsINeZ16fXoNei150g16LXmdec15nXqiwgSXNyYWVsIjASLgoUChIJRc2Pe8CuHRURcHG6fA2-grEQBCoUChIJLc_ihsauHRUR7Xy9-flv7zs",},
{"formatted_address":"Yehuda Hayamit St 44, Tel Aviv-Yafo, Israel","geometry":{"location":{"lat":32.0503293,"lng":34.7521265},"viewport":{"south":32.0489163697085,"west":34.7507631697085,"north":32.0516143302915,"east":34.7534611302915}},"place_id":"ChIJ12wxALhMHRURwNBLgKw2Frc"},
{"formatted_address":"Schmorak St 18, Holon, Israel","geometry":{"location":{"lat":32.0127376,"lng":34.7860741},"viewport":{"south":32.0113840697085,"west":34.7847952697085,"north":32.0140820302915,"east":34.7874932302915}},"place_id":"ChIJ8_Nr27y0AhURATtaeT1KR3A"}
]

# Function to handle Decimal serialization
def default_serializer(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError(f'Object of type {obj.__class__.__name__} is not JSON serializable')

# Sample listing to use as template
sample_listing = {
    "category": "rent",
    "listingId": "listing2",
    "title": "Cozy Studio Apartment",
    "description": "A charming studio apartment perfect for a single occupant.",
    "ownerId": "user3",
    "contractStartDate": "2024-06-01",
    "contractEndDate": "2024-12-01",
    "contractLength": "6 months",
    "postUploadDate": "2024-04-02",
    "postExpireDate": "2024-06-01",
    "numberOfRooms": 1,
    "parkingSpaces": 0,
    "isAnimalFriendly": True,
    "isActive": True,
    "isWithGardenOrPorch": True,
    "isPricePerWholeTime": False,
    "pricePerMonth": 546,
    "pricePerWholeTime": 10000,
    "likedBy": [],
    "images": [
        "https://tindira.s3.us-east-2.amazonaws.com/listings/listing2/image1.jpg",
        "https://tindira.s3.us-east-2.amazonaws.com/listings/listing2/image2.jpg",
        "https://tindira.s3.us-east-2.amazonaws.com/listings/listing2/image3.jpg"
    ],
    "coordinates": {
        "formatted_address": "Shlomo HaMelekh St 4, Tel Aviv-Yafo, Israel",
        "geometry": {
            "location": {
                "lat": 32.0767329,
                "lng": 34.7767408
            },
            "viewport": {
                "south": 32.07537376970851,
                "west": 34.7753480197085,
                "north": 32.0780717302915,
                "east": 34.77804598029149
            }
        },
        "place_id": "ChIJLWJp2IBLHRUR0UdwZnvPk90"
    }
}

# Function to calculate contract length in months
def calculate_contract_length(start_date, end_date):
    start = datetime.strptime(start_date, '%Y-%m-%d')
    end = datetime.strptime(end_date, '%Y-%m-%d')
    delta = relativedelta(end, start)
    return delta.years * 12 + delta.months

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
def generate_listing(index, address_info, start_date=None, is_sublet=False):
    listing = sample_listing.copy()
    listing['likedBy'] = [f"user{random.randint(1, 20)}"]
    listing['listingId'] = f"listing{index}"
    if start_date:
        listing['contractStartDate'] = start_date
    else:
        listing['contractStartDate'] = fake_he.date_between(start_date='now', end_date='+6m').strftime('%Y-%m-%d')
    
    listing['pricePerMonth'] = random.randint(20, 100) * 100  # Ensure pricePerMonth ends in 00
    
    if is_sublet:
        days_duration = random.randint(2, 30)
        listing['contractEndDate'] = (datetime.strptime(listing['contractStartDate'], '%Y-%m-%d') + timedelta(days=days_duration)).strftime('%Y-%m-%d')
        # Calculate pricePerWholeTime for sublets
        daily_rate = listing['pricePerMonth'] / 30
        listing['pricePerWholeTime'] = int(daily_rate * days_duration)
        listing['contractLength'] = f"{days_duration} days"
    else:
        if random.random() < 0.7:
            listing['contractEndDate'] = (datetime.strptime(listing['contractStartDate'], '%Y-%m-%d') + relativedelta(years=1)).strftime('%Y-%m-%d')
        else:
            listing['contractEndDate'] = fake_he.date_between_dates(datetime.strptime(listing['contractStartDate'], '%Y-%m-%d'), datetime.strptime(listing['contractStartDate'], '%Y-%m-%d') + relativedelta(years=1)).strftime('%Y-%m-%d')
        contract_length_months = calculate_contract_length(listing['contractStartDate'], listing['contractEndDate'])
        listing['pricePerWholeTime'] = listing['pricePerMonth'] * contract_length_months
        listing['contractLength'] = f"{contract_length_months} months"

    listing['postUploadDate'] = fake_he.date_between(start_date='-1y', end_date='now').strftime('%Y-%m-%d')
    listing['postExpireDate'] = fake_he.date_between(start_date='now', end_date='+6m').strftime('%Y-%m-%d')
    listing['numberOfRooms'] = random.randint(1, 6)
    listing['parkingSpaces'] = random.randint(0, 3)
    listing['ownerId'] = f"user{random.randint(1, 20)}"
    listing['isAnimalFriendly'] = random.choice([True, False])
    listing['isActive'] = random.choice([True, False])
    listing['isWithGardenOrPorch'] = random.choice([True, False])
    listing['isPricePerWholeTime'] = random.choice([True, False])
    listing['category'] = "sublet" if is_sublet else "rent"

    listing['coordinates'] = address_info
    listing['title'] = generate_apartment_title()
    
    # Generate 3 images
    listing['images'] = [f"https://tindira.s3.us-east-2.amazonaws.com/listings/{listing['listingId']}/image{i+1}.jpg" for i in range(10)]
    
    return listing

# Generate listings using addresses in a round-robin fashion
total_listings = 100
listings = []

# Add 10 rents and 10 sublets starting on 1st of July 2024
for i in range(10):
    address_info = addresses[i % len(addresses)]
    listings.append(generate_listing(i + 1, address_info, start_date="2024-07-01", is_sublet=False))

for i in range(10):
    address_info = addresses[(10 + i) % len(addresses)]
    listings.append(generate_listing(11 + i, address_info, start_date="2024-07-01", is_sublet=True))

# Generate remaining listings
for i in range(20, total_listings):
    address_info = addresses[i % len(addresses)]
    is_sublet = random.random() < 0.35
    listings.append(generate_listing(i + 1, address_info, is_sublet=is_sublet))

# Convert to JSON
json_output = json.dumps(listings, indent=4, default=default_serializer)

# Save to file (optional)
with open('listings.json', 'w') as f:
    f.write(json_output)

print(json_output)
