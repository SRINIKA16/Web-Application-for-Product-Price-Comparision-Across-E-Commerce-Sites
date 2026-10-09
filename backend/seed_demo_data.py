import os
import sys
import django
from datetime import timedelta
from random import randint, uniform, choice

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from django.utils import timezone
from products.models import Category, Product
from stores.models import Store
from offers.models import ProductOffer, PriceHistory
from wishlist.models import Wishlist
from alerts.models import PriceAlert
from analytics.models import SearchHistory

def seed_database():
    print("Starting PriceWise database seeding...")

    # Clear existing data
    PriceHistory.objects.all().delete()
    ProductOffer.objects.all().delete()
    Product.objects.all().delete()
    Category.objects.all().delete()
    Store.objects.all().delete()
    Wishlist.objects.all().delete()
    PriceAlert.objects.all().delete()
    SearchHistory.objects.all().delete()

    # 1. Create Stores
    stores_data = [
        {"name": "Amazon", "logo": "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=120", "website": "https://www.amazon.in?ref=pricewise_demo", "rating": 4.8},
        {"name": "Flipkart", "logo": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=120", "website": "https://www.flipkart.com?ref=pricewise_demo", "rating": 4.6},
        {"name": "Croma", "logo": "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=120", "website": "https://www.croma.com?ref=pricewise_demo", "rating": 4.5},
        {"name": "Reliance Digital", "logo": "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=120", "website": "https://www.reliancedigital.in?ref=pricewise_demo", "rating": 4.4},
        {"name": "Myntra", "logo": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=120", "website": "https://www.myntra.com?ref=pricewise_demo", "rating": 4.7},
    ]

    stores = []
    for s in stores_data:
        store_obj = Store.objects.create(**s)
        stores.append(store_obj)
    print(f"Created {len(stores)} stores.")

    # 2. Create Categories
    categories_data = [
        {"name": "Mobiles", "slug": "mobiles", "icon": "Smartphone"},
        {"name": "Laptops", "slug": "laptops", "icon": "Laptop"},
        {"name": "Headphones", "slug": "headphones", "icon": "Headphones"},
        {"name": "Smart Watches", "slug": "smart-watches", "icon": "Watch"},
        {"name": "TVs", "slug": "tvs", "icon": "Tv"},
        {"name": "Cameras", "slug": "cameras", "icon": "Camera"},
        {"name": "Home Appliances", "slug": "home-appliances", "icon": "Home"},
    ]

    categories = {}
    for c in categories_data:
        cat_obj = Category.objects.create(**c)
        categories[c["slug"]] = cat_obj
    print(f"Created {len(categories)} categories.")

    # 3. Create Demo Products (32 products)
    products_seed = [
        # Smartphones
        {
            "name": "Samsung Galaxy S25 5G 256GB",
            "brand": "Samsung",
            "model_number": "SM-S931B",
            "category": categories["mobiles"],
            "description": "Flagship smartphone featuring Snapdragon 8 Elite, 200MP Quad Camera system, Dynamic AMOLED 2X 120Hz Display.",
            "image_url": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600",
            "rating": 4.7,
            "review_count": 3420,
            "base_price": 75999,
            "specs": {"ram": "12GB", "storage": "256GB", "camera": "200MP + 50MP + 12MP", "battery": "5000mAh", "screen": "6.7 inch AMOLED"}
        },
        {
            "name": "Apple iPhone 16 Pro Max 256GB Desert Titanium",
            "brand": "Apple",
            "model_number": "MYW73HN/A",
            "category": categories["mobiles"],
            "description": "Grade 5 Titanium design with A18 Pro chip, 48MP Fusion camera system, and industry-leading battery life.",
            "image_url": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600",
            "rating": 4.9,
            "review_count": 8920,
            "base_price": 144900,
            "specs": {"ram": "8GB", "storage": "256GB", "camera": "48MP Triple Camera", "battery": "4685mAh", "screen": "6.9 inch Super Retina XDR"}
        },
        {
            "name": "OnePlus 13 5G 256GB Silky Black",
            "brand": "OnePlus",
            "model_number": "CPH2609",
            "category": categories["mobiles"],
            "description": "Hasselblad 4th Gen Camera for Mobile, Snapdragon 8 Gen 4, 100W SUPERVOOC charging.",
            "image_url": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
            "rating": 4.6,
            "review_count": 1840,
            "base_price": 64999,
            "specs": {"ram": "12GB", "storage": "256GB", "camera": "50MP Triple Sony Camera", "battery": "5400mAh", "screen": "6.82 inch QHD+"}
        },
        {
            "name": "Google Pixel 9 Pro 128GB Hazel",
            "brand": "Google",
            "model_number": "GA05206-IN",
            "category": categories["mobiles"],
            "description": "Google Tensor G4 with Gemini Nano AI integrated natively, Studio-quality camera system.",
            "image_url": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600",
            "rating": 4.5,
            "review_count": 950,
            "base_price": 109999,
            "specs": {"ram": "16GB", "storage": "128GB", "camera": "50MP Triple Pixel AI", "battery": "4700mAh", "screen": "6.3 inch OLED"}
        },
        {
            "name": "Xiaomi 14 Ultra 512GB Black",
            "brand": "Xiaomi",
            "model_number": "24030PN60G",
            "category": categories["mobiles"],
            "description": "Leica Quad Camera optics with stepless variable aperture, Snapdragon 8 Gen 3.",
            "image_url": "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=600",
            "rating": 4.4,
            "review_count": 620,
            "base_price": 99999,
            "specs": {"ram": "16GB", "storage": "512GB", "camera": "50MP Quad Leica Optics", "battery": "5000mAh", "screen": "6.73 inch WQHD+"}
        },
        {
            "name": "Nothing Phone (2a) Plus 256GB Grey",
            "brand": "Nothing",
            "model_number": "A065",
            "category": categories["mobiles"],
            "description": "Unique Glyph Interface design with MediaTek Dimensity 7350 Pro 5G processor.",
            "image_url": "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600",
            "rating": 4.4,
            "review_count": 2100,
            "base_price": 27999,
            "specs": {"ram": "12GB", "storage": "256GB", "camera": "50MP Dual Camera", "battery": "5000mAh", "screen": "6.7 inch AMOLED 120Hz"}
        },
        # Laptops
        {
            "name": "Apple MacBook Air M3 15-inch 16GB 512GB Space Grey",
            "brand": "Apple",
            "model_number": "MRYM3HN/A",
            "category": categories["laptops"],
            "description": "Incredibly thin chassis powered by Apple M3 chip, up to 18 hours of battery life, Liquid Retina display.",
            "image_url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600",
            "rating": 4.8,
            "review_count": 1420,
            "base_price": 134900,
            "specs": {"ram": "16GB", "storage": "512GB SSD", "processor": "Apple M3 (8-Core CPU / 10-Core GPU)", "display": "15.3 inch Liquid Retina"}
        },
        {
            "name": "Dell XPS 13 9340 Intel Core Ultra 7 16GB 1TB",
            "brand": "Dell",
            "model_number": "XPS9340-7811SLV",
            "category": categories["laptops"],
            "description": "Crafted with machined aluminum, InfinityEdge OLED Touch display with Intel AI Boost NPU.",
            "image_url": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600",
            "rating": 4.6,
            "review_count": 580,
            "base_price": 149990,
            "specs": {"ram": "16GB LPDDR5X", "storage": "1TB NVMe SSD", "processor": "Intel Core Ultra 7 155H", "display": "13.4 inch 3K OLED Touch"}
        },
        {
            "name": "ASUS ROG Zephyrus G16 OLED Ryzen 9 32GB 1TB RTX 4070",
            "brand": "ASUS",
            "model_number": "GA605WI-QR043WS",
            "category": categories["laptops"],
            "description": "Ultra-thin gaming laptop with 240Hz ROG Nebula OLED display and NVIDIA GeForce RTX 4070.",
            "image_url": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600",
            "rating": 4.7,
            "review_count": 890,
            "base_price": 189990,
            "specs": {"ram": "32GB LPDDR5X", "storage": "1TB PCIe Gen 4", "graphics": "RTX 4070 8GB", "display": "16 inch 2.5K 240Hz OLED"}
        },
        {
            "name": "Lenovo Yoga Slim 7i Aura Edition Intel Core Ultra 7 16GB",
            "brand": "Lenovo",
            "model_number": "83HM000GIN",
            "category": categories["laptops"],
            "description": "Intel Evo certified premium lightweight creator laptop with Smart Share cross-device connectivity.",
            "image_url": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600",
            "rating": 4.5,
            "review_count": 430,
            "base_price": 112990,
            "specs": {"ram": "16GB", "storage": "1TB SSD", "processor": "Intel Core Ultra 7 258V", "display": "15.3 inch 2.8K 120Hz"}
        },
        {
            "name": "HP Pavilion Plus 14 AMD Ryzen 7 16GB 512GB OLED",
            "brand": "HP",
            "model_number": "14-ey0023AU",
            "category": categories["laptops"],
            "description": "All-metal sleek notebook with 2.8K 120Hz IMAX Enhanced certified OLED display.",
            "image_url": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
            "rating": 4.4,
            "review_count": 760,
            "base_price": 78990,
            "specs": {"ram": "16GB DDR5", "storage": "512GB M.2 SSD", "processor": "AMD Ryzen 7 7840U", "display": "14 inch 2.8K OLED"}
        },
        # Headphones
        {
            "name": "Sony WH-1000XM5 Wireless Noise Canceling Headphones Black",
            "brand": "Sony",
            "model_number": "WH1000XM5/B",
            "category": categories["headphones"],
            "description": "Industry-leading noise canceling with two processors and 8 microphones, up to 30-hour battery life.",
            "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
            "rating": 4.8,
            "review_count": 12400,
            "base_price": 29990,
            "specs": {"type": "Over-Ear Wireless", "battery": "30 Hours", "noise_cancellation": "Active Noise Canceling (ANC)", "weight": "250g"}
        },
        {
            "name": "Bose QuietComfort Ultra Headphones Black",
            "brand": "Bose",
            "model_number": "880066-0010",
            "category": categories["headphones"],
            "description": "World-class spatial audio with Immersive Audio mode and CustomTune technology.",
            "image_url": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600",
            "rating": 4.7,
            "review_count": 4890,
            "base_price": 35900,
            "specs": {"type": "Over-Ear", "battery": "24 Hours", "noise_cancellation": "Quiet/Aware/Immersion Modes"}
        },
        {
            "name": "Apple AirPods Pro (2nd Gen) with MagSafe Case (USB-C)",
            "brand": "Apple",
            "model_number": "MTJV3HN/A",
            "category": categories["headphones"],
            "description": "H2 chip delivers up to 2x more Active Noise Cancellation, Adaptive Audio, and Conversation Awareness.",
            "image_url": "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600",
            "rating": 4.8,
            "review_count": 19500,
            "base_price": 24900,
            "specs": {"type": "In-Ear True Wireless", "battery": "30 Hours total", "chip": "Apple H2", "water_resistance": "IP54"}
        },
        {
            "name": "Sennheiser Momentum 4 Wireless Denim Edition",
            "brand": "Sennheiser",
            "model_number": "M4AEBT",
            "category": categories["headphones"],
            "description": "Audiophile-inspired 42mm transducer system with massive 60-hour battery playback.",
            "image_url": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600",
            "rating": 4.6,
            "review_count": 1650,
            "base_price": 26990,
            "specs": {"type": "Over-Ear", "battery": "60 Hours", "codecs": "aptX Adaptive, AAC, SBC"}
        },
        # Smart Watches
        {
            "name": "Apple Watch Ultra 2 GPS + Cellular 49mm Titanium",
            "brand": "Apple",
            "model_number": "MREX3HN/A",
            "category": categories["smart-watches"],
            "description": "The ultimate sports watch with aerospace-grade titanium case, S9 SiP with Double Tap gesture.",
            "image_url": "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600",
            "rating": 4.9,
            "review_count": 3120,
            "base_price": 89900,
            "specs": {"display": "3000 nits OLED", "battery": "36 Hours normal / 72 Hours low power", "water_depth": "100m water resistance"}
        },
        {
            "name": "Samsung Galaxy Watch7 Ultra 47mm Titanium Silver",
            "brand": "Samsung",
            "model_number": "SM-L705F",
            "category": categories["smart-watches"],
            "description": "Powered by 3nm processor with dual-frequency GPS, Energy Score AI tracking.",
            "image_url": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600",
            "rating": 4.6,
            "review_count": 1450,
            "base_price": 59999,
            "specs": {"display": "Super AMOLED 3000 nits", "battery": "Up to 100 Hours", "sensors": "BioActive Sensor 2nd Gen"}
        },
        {
            "name": "Garmin Fenix 8 Sapphire AMOLED 47mm Slate Grey",
            "brand": "Garmin",
            "model_number": "010-02904-20",
            "category": categories["smart-watches"],
            "description": "Premium multisport GPS smartwatch built to perform with speaker/mic for voice calls.",
            "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
            "rating": 4.8,
            "review_count": 520,
            "base_price": 104990,
            "specs": {"display": "1.4 inch AMOLED Sapphire", "battery": "16 Days smartwatch mode", "flashlight": "Built-in LED Flashlight"}
        },
        # TVs
        {
            "name": "Sony BRAVIA 8 55-inch 4K Ultra HD Smart OLED TV",
            "brand": "Sony",
            "model_number": "K-55XR80",
            "category": categories["tvs"],
            "description": "XR Processor delivering pure OLED blacks, Acoustic Surface Audio+, Dolby Vision, PS5 ready.",
            "image_url": "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600",
            "rating": 4.8,
            "review_count": 890,
            "base_price": 169990,
            "specs": {"display": "55 inch 4K OLED 120Hz", "audio": "50W 2.1ch Acoustic Surface", "os": "Google TV"}
        },
        {
            "name": "LG C4 65-inch 4K Smart OLED evo TV",
            "brand": "LG",
            "model_number": "OLED65C4PSA",
            "category": categories["tvs"],
            "description": "alpha 9 AI Processor Gen 7, 144Hz VRR support, G-Sync certified gaming monster.",
            "image_url": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600",
            "rating": 4.9,
            "review_count": 2400,
            "base_price": 209990,
            "specs": {"display": "65 inch 4K OLED evo 144Hz", "audio": "40W 2.2ch Dolby Atmos", "os": "webOS 24"}
        },
        {
            "name": "Samsung Neo QLED 4K 55-inch QN90D Smart TV",
            "brand": "Samsung",
            "model_number": "QA55QN90DAULXL",
            "category": categories["tvs"],
            "description": "NQ4 AI Gen2 Processor with Quantum Matrix Mini-LED tech and Anti-Glare screen.",
            "image_url": "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=600",
            "rating": 4.7,
            "review_count": 1120,
            "base_price": 139990,
            "specs": {"display": "55 inch Neo QLED 144Hz", "audio": "60W 4.2.2ch OTS+", "os": "Tizen OS"}
        },
        # Cameras
        {
            "name": "Sony Alpha 7 IV Full-Frame Mirrorless Camera Body",
            "brand": "Sony",
            "model_number": "ILCE-7M4/B",
            "category": categories["cameras"],
            "description": "33MP Exmor R CMOS sensor, BIONZ XR engine, 4K 60p recording, Real-time Eye AF.",
            "image_url": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600",
            "rating": 4.9,
            "review_count": 1980,
            "base_price": 209990,
            "specs": {"sensor": "33MP Full-Frame Exmor R", "video": "4K 60p 10-bit 4:2:2", "stabilization": "5-axis In-body IS"}
        },
        {
            "name": "Canon EOS R6 Mark II Mirrorless Body",
            "brand": "Canon",
            "model_number": "5668C013",
            "category": categories["cameras"],
            "description": "24.2MP CMOS sensor with up to 40 fps electronic shutter burst shooting and Dual Pixel CMOS AF II.",
            "image_url": "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600",
            "rating": 4.8,
            "review_count": 1150,
            "base_price": 215995,
            "specs": {"sensor": "24.2MP Full-Frame", "video": "6K Over-sampled 4K 60p", "burst": "40 fps Electronic"}
        },
        {
            "name": "Fujifilm X-T5 Mirrorless Camera Body Silver",
            "brand": "Fujifilm",
            "model_number": "16782356",
            "category": categories["cameras"],
            "description": "40.2MP X-Trans CMOS 5 HR sensor, dial-based classic control layout with 7-stop IBIS.",
            "image_url": "https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=600",
            "rating": 4.7,
            "review_count": 890,
            "base_price": 149999,
            "specs": {"sensor": "40.2MP APS-C X-Trans", "video": "6.2K 30p 10-bit", "stabilization": "7.0-stop IBIS"}
        },
        # Home Appliances
        {
            "name": "Dyson V15 Detect Cordless Vacuum Cleaner",
            "brand": "Dyson",
            "model_number": "368340-01",
            "category": categories["home-appliances"],
            "description": "Laser reveals invisible dust, piezo sensor count and measures dust particles in real time.",
            "image_url": "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600",
            "rating": 4.7,
            "review_count": 3100,
            "base_price": 62900,
            "specs": {"suction": "230AW", "runtime": "60 Minutes", "filtration": "Whole-machine HEPA"}
        },
        {
            "name": "LG 9 Kg 5 Star AI Direct Drive Front Load Washing Machine",
            "brand": "LG",
            "model_number": "FHP1209Z5M",
            "category": categories["home-appliances"],
            "description": "6 Motion Direct Drive with Steam allergy care and ThinQ Wi-Fi smart control.",
            "image_url": "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600",
            "rating": 4.6,
            "review_count": 4150,
            "base_price": 43990,
            "specs": {"capacity": "9 Kg", "rating": "5 Star BEE", "rpm": "1200 RPM", "motor": "Inverter Direct Drive"}
        },
        {
            "name": "Samsung 653L 3-Door Side by Side Refrigerator with Convertible 5in1",
            "brand": "Samsung",
            "model_number": "RS76CG8003S9",
            "category": categories["home-appliances"],
            "description": "SpaceMax technology, Twin Cooling Plus system, SmartThings AI Energy mode.",
            "image_url": "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600",
            "rating": 4.5,
            "review_count": 2890,
            "base_price": 84990,
            "specs": {"capacity": "653 Litres", "rating": "3 Star", "technology": "Twin Cooling Plus", "smart": "Wi-Fi Enabled"}
        }
    ]

    products = []
    for p_data in products_seed:
        base_p = p_data.pop("base_price")
        specs = p_data.pop("specs")
        prod = Product.objects.create(specifications=specs, **p_data)
        products.append((prod, base_p))
    print(f"Created {len(products)} products.")

    # 4. Create Product Offers & Price History across 5 Stores
    now = timezone.now()
    total_offers = 0
    total_logs = 0

    for prod, base_price in products:
        # Create offer for each store (or 3-5 stores)
        store_choices = stores if len(stores) <= 5 else stores[:randint(3, 5)]
        
        lowest_offer_price = base_price
        
        for store in store_choices:
            # Vary price by -8% to +6% per store
            variation = uniform(-0.08, 0.06)
            store_price = round(base_price * (1 + variation), -1) # rounded to nearest 10
            
            discount = choice([0, 500, 1000, 1500, 2000, 3000, 4000]) if store_price > 10000 else choice([0, 200, 500])
            delivery = choice([0, 0, 0, 150, 499])
            avail = choice(['In Stock', 'In Stock', 'In Stock', 'Limited Stock', 'Out of Stock'])
            is_cond = choice([True, False, False])
            offer_det = choice([
                "10% Instant Discount on HDFC Bank Credit Cards",
                "Flat ₹1500 Cashback on ICICI Bank Cards",
                "Extra ₹2000 off on Exchange",
                "No Cost EMI available up to 12 months",
                ""
            ]) if is_cond else ""

            offer = ProductOffer.objects.create(
                product=prod,
                store=store,
                price=store_price,
                discount=discount,
                delivery_charge=delivery,
                availability=avail,
                rating=round(uniform(4.1, 4.9), 1),
                product_url=f"{store.website}&pid={prod.id}&demo=true",
                is_conditional_offer=is_cond,
                offer_details=offer_det
            )
            total_offers += 1

            # Generate 180 days of historical price points for Recharts graph
            current_hist_price = float(store_price)
            for days_ago in range(180, 0, -15):
                hist_date = now - timedelta(days=days_ago)
                # random price fluctuation
                fluctuation = uniform(-0.05, 0.05)
                current_hist_price = round(current_hist_price * (1 + fluctuation), -1)
                PriceHistory.objects.create(
                    product=prod,
                    store=store,
                    price=current_hist_price,
                    recorded_at=hist_date
                )
                total_logs += 1

    print(f"Created {total_offers} product offers.")
    print(f"Created {total_logs} price history records.")

    # 5. Create Demo User & Initial Wishlist / Alerts / Search History
    user, created = User.objects.get_or_create(username='demouser', email='demo@pricewise.com')
    if created:
        user.set_password('demo1234')
        user.first_name = 'Alex'
        user.last_name = 'Morgan'
        user.save()

    # Create admin user
    admin_user, admin_created = User.objects.get_or_create(username='admin', email='admin@pricewise.com', is_staff=True, is_superuser=True)
    if admin_created:
        admin_user.set_password('admin1234')
        admin_user.first_name = 'System'
        admin_user.last_name = 'Admin'
        admin_user.save()

    # Seed Wishlist
    p1 = products[0][0] # Galaxy S25
    p2 = products[1][0] # iPhone 16 Pro Max
    p3 = products[6][0] # MacBook Air M3
    Wishlist.objects.create(user=user, product=p1)
    Wishlist.objects.create(user=user, product=p3)

    # Seed Price Alert
    PriceAlert.objects.create(user=user, product=p1, target_price=71000, current_price=71999, active=True)
    PriceAlert.objects.create(user=user, product=p2, target_price=135000, current_price=142900, active=True)

    # Seed Search History
    SearchHistory.objects.create(user=user, search_query="Samsung Galaxy S25")
    SearchHistory.objects.create(user=user, search_query="MacBook Air M3")
    SearchHistory.objects.create(user=user, search_query="Sony WH-1000XM5")
    SearchHistory.objects.create(search_query="iPhone 16 Pro")

    print("Database seeding complete!")

if __name__ == '__main__':
    seed_database()
