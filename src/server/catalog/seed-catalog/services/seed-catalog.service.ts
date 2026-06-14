import { inArray, or } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import {
	category,
	color,
	product,
	ram,
	screenSize,
	storage,
	variant,
	variantImage,
} from "#/db/schema";
import { badRequestError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import { createProductSchema } from "../../products/products.schemas";
import { createVariantSchema } from "../../variants/variants.schemas";
import { seedCatalogSummarySchema } from "../seed-catalog.schemas";
import type {
	SeedCatalogOutputType,
	SeedCatalogSummaryType,
} from "../seed-catalog.types";

const INSERT_BATCH_SIZE = 100;
const IMAGE_INSERT_BATCH_SIZE = 300;
const MINIMUM_SEED_PRODUCTS = 500;
const VARIANTS_PER_PRODUCT = 5;

const CATEGORY_SEEDS = [
	{
		name: "Phones",
		slug: "phones",
		icon: "Smartphone",
		iconColor: "#2563EB",
		iconBg: "#DBEAFE",
		imageBg: "#DBEAFE",
	},
	{
		name: "Laptops",
		slug: "laptops",
		icon: "Laptop",
		iconColor: "#4F46E5",
		iconBg: "#E0E7FF",
		imageBg: "#E0E7FF",
	},
	{
		name: "Tablets",
		slug: "tablets",
		icon: "Tablet",
		iconColor: "#0891B2",
		iconBg: "#CFFAFE",
		imageBg: "#CFFAFE",
	},
	{
		name: "Smartwatches",
		slug: "smartwatches",
		icon: "Watch",
		iconColor: "#059669",
		iconBg: "#D1FAE5",
		imageBg: "#D1FAE5",
	},
	{
		name: "Headphones",
		slug: "headphones",
		icon: "Headphones",
		iconColor: "#D97706",
		iconBg: "#FEF3C7",
		imageBg: "#FEF3C7",
	},
	{
		name: "Gaming",
		slug: "gaming",
		icon: "Gamepad2",
		iconColor: "#DC2626",
		iconBg: "#FEE2E2",
		imageBg: "#FEE2E2",
	},
	{
		name: "Monitors",
		slug: "monitors",
		icon: "Monitor",
		iconColor: "#7C3AED",
		iconBg: "#EDE9FE",
		imageBg: "#EDE9FE",
	},
	{
		name: "Accessories",
		slug: "accessories",
		icon: "Cable",
		iconColor: "#475569",
		iconBg: "#E2E8F0",
		imageBg: "#E2E8F0",
	},
	{
		name: "Cameras",
		slug: "cameras",
		icon: "Camera",
		iconColor: "#BE123C",
		iconBg: "#FFE4E6",
		imageBg: "#FFE4E6",
	},
	{
		name: "Storage",
		slug: "storage",
		icon: "HardDrive",
		iconColor: "#0F766E",
		iconBg: "#CCFBF1",
		imageBg: "#CCFBF1",
	},
] as const;

type CategoryName = (typeof CATEGORY_SEEDS)[number]["name"];

const COLOR_SEEDS = [
	{ name: "Black", hexCode: "#111827" },
	{ name: "White", hexCode: "#F8FAFC" },
	{ name: "Silver", hexCode: "#C0C0C0" },
	{ name: "Space Gray", hexCode: "#4B5563" },
	{ name: "Graphite", hexCode: "#374151" },
	{ name: "Midnight", hexCode: "#172554" },
	{ name: "Blue", hexCode: "#2563EB" },
	{ name: "Sky Blue", hexCode: "#7DD3FC" },
	{ name: "Green", hexCode: "#16A34A" },
	{ name: "Red", hexCode: "#DC2626" },
	{ name: "Pink", hexCode: "#F9A8D4" },
	{ name: "Purple", hexCode: "#9333EA" },
	{ name: "Gold", hexCode: "#D4AF37" },
	{ name: "Natural Titanium", hexCode: "#B8B1A3" },
	{ name: "Blue Titanium", hexCode: "#6B7A90" },
	{ name: "Desert Titanium", hexCode: "#C9A27B" },
	{ name: "Cream", hexCode: "#FFF7D6" },
	{ name: "Platinum", hexCode: "#E5E7EB" },
] as const;

const STORAGE_SEEDS = [
	{ name: "32 GB", valueGb: 32 },
	{ name: "64 GB", valueGb: 64 },
	{ name: "128 GB", valueGb: 128 },
	{ name: "256 GB", valueGb: 256 },
	{ name: "512 GB", valueGb: 512 },
	{ name: "1 TB", valueGb: 1024 },
	{ name: "2 TB", valueGb: 2048 },
	{ name: "4 TB", valueGb: 4096 },
	{ name: "8 TB", valueGb: 8192 },
] as const;

const RAM_SEEDS = [
	{ name: "4 GB", valueGb: 4 },
	{ name: "6 GB", valueGb: 6 },
	{ name: "8 GB", valueGb: 8 },
	{ name: "12 GB", valueGb: 12 },
	{ name: "16 GB", valueGb: 16 },
	{ name: "18 GB", valueGb: 18 },
	{ name: "24 GB", valueGb: 24 },
	{ name: "32 GB", valueGb: 32 },
	{ name: "36 GB", valueGb: 36 },
	{ name: "48 GB", valueGb: 48 },
	{ name: "64 GB", valueGb: 64 },
	{ name: "96 GB", valueGb: 96 },
	{ name: "128 GB", valueGb: 128 },
] as const;

const SCREEN_SIZE_SEEDS = [
	{ name: "1.2-inch", valueInches: 1.2 },
	{ name: "1.3-inch", valueInches: 1.3 },
	{ name: "1.4-inch", valueInches: 1.4 },
	{ name: "1.5-inch", valueInches: 1.5 },
	{ name: "4.7-inch", valueInches: 4.7 },
	{ name: "6.1-inch", valueInches: 6.1 },
	{ name: "6.2-inch", valueInches: 6.2 },
	{ name: "6.4-inch", valueInches: 6.4 },
	{ name: "6.7-inch", valueInches: 6.7 },
	{ name: "6.8-inch", valueInches: 6.8 },
	{ name: "7.0-inch", valueInches: 7.0 },
	{ name: "7.6-inch", valueInches: 7.6 },
	{ name: "8.3-inch", valueInches: 8.3 },
	{ name: "8.8-inch", valueInches: 8.8 },
	{ name: "10.2-inch", valueInches: 10.2 },
	{ name: "10.9-inch", valueInches: 10.9 },
	{ name: "11.0-inch", valueInches: 11.0 },
	{ name: "12.4-inch", valueInches: 12.4 },
	{ name: "12.9-inch", valueInches: 12.9 },
	{ name: "13.0-inch", valueInches: 13.0 },
	{ name: "13.3-inch", valueInches: 13.3 },
	{ name: "13.5-inch", valueInches: 13.5 },
	{ name: "13.6-inch", valueInches: 13.6 },
	{ name: "14.0-inch", valueInches: 14.0 },
	{ name: "14.2-inch", valueInches: 14.2 },
	{ name: "15.0-inch", valueInches: 15.0 },
	{ name: "15.3-inch", valueInches: 15.3 },
	{ name: "15.6-inch", valueInches: 15.6 },
	{ name: "16.0-inch", valueInches: 16.0 },
	{ name: "16.2-inch", valueInches: 16.2 },
	{ name: "17.0-inch", valueInches: 17.0 },
	{ name: "24.0-inch", valueInches: 24.0 },
	{ name: "27.0-inch", valueInches: 27.0 },
	{ name: "28.0-inch", valueInches: 28.0 },
	{ name: "32.0-inch", valueInches: 32.0 },
	{ name: "34.0-inch", valueInches: 34.0 },
	{ name: "40.0-inch", valueInches: 40.0 },
	{ name: "42.0-inch", valueInches: 42.0 },
	{ name: "45.0-inch", valueInches: 45.0 },
	{ name: "49.0-inch", valueInches: 49.0 },
] as const;

const PRODUCT_SEED_TEXT = {
	Phones: `
Apple|iPhone 15 Pro
Apple|iPhone 15 Pro Max
Apple|iPhone 15
Apple|iPhone 15 Plus
Apple|iPhone 14
Apple|iPhone 14 Plus
Apple|iPhone 13
Apple|iPhone SE (3rd generation)
Samsung|Galaxy S24 Ultra
Samsung|Galaxy S24+
Samsung|Galaxy S24
Samsung|Galaxy S23 Ultra
Samsung|Galaxy S23 FE
Samsung|Galaxy Z Fold5
Samsung|Galaxy Z Flip5
Samsung|Galaxy A54 5G
Samsung|Galaxy A35 5G
Google|Pixel 8 Pro
Google|Pixel 8
Google|Pixel 8a
Google|Pixel 7a
Google|Pixel Fold
OnePlus|OnePlus 12
OnePlus|OnePlus 12R
OnePlus|OnePlus Open
OnePlus|Nord 3 5G
Motorola|Razr+ 2023
Motorola|Edge 50 Pro
Motorola|Moto G Power 5G
Nothing|Phone (2)
Nothing|Phone (2a)
Sony|Xperia 1 V
Sony|Xperia 5 V
ASUS|ROG Phone 8 Pro
Xiaomi|Xiaomi 14 Ultra
Xiaomi|Redmi Note 13 Pro+
Xiaomi|Poco F6 Pro
OPPO|Find X7 Ultra
OPPO|Reno11 Pro
Vivo|X100 Pro
Honor|Magic6 Pro
Fairphone|Fairphone 5
Nokia|XR21
TCL|40 XL
Realme|GT 5 Pro
Huawei|Pura 70 Pro
Samsung|Galaxy A15 5G
Google|Pixel 7 Pro
Apple|iPhone 12
Motorola|ThinkPhone by Motorola
`,
	Laptops: `
Apple|MacBook Air 13-inch M3
Apple|MacBook Air 15-inch M3
Apple|MacBook Pro 14-inch M3
Apple|MacBook Pro 14-inch M3 Pro
Apple|MacBook Pro 16-inch M3 Max
Dell|XPS 13
Dell|XPS 14
Dell|XPS 16
Dell|XPS 15
Dell|Latitude 7440
HP|Spectre x360 14
HP|Spectre x360 16
HP|Envy x360 15
HP|EliteBook 1040 G10
HP|Omen Transcend 14
Lenovo|ThinkPad X1 Carbon Gen 12
Lenovo|ThinkPad X1 Yoga Gen 8
Lenovo|ThinkPad T14s Gen 4
Lenovo|Yoga 9i 14
Lenovo|Legion Slim 5 16
ASUS|Zenbook 14 OLED
ASUS|Zenbook Duo 14 OLED
ASUS|ROG Zephyrus G14
ASUS|ROG Zephyrus G16
ASUS|ROG Strix Scar 16
Acer|Swift Go 14
Acer|Swift Edge 16
Acer|Predator Helios Neo 16
Microsoft|Surface Laptop 5 13.5-inch
Microsoft|Surface Laptop Studio 2
Razer|Blade 14
Razer|Blade 16
Framework|Laptop 13
Framework|Laptop 16
MSI|Prestige 16 AI Evo
MSI|Stealth 14 Studio
Samsung|Galaxy Book4 Pro 14
Samsung|Galaxy Book4 Ultra
LG|Gram 14
LG|Gram 17
Alienware|m16 R2
Gigabyte|Aero 16 OLED
Huawei|MateBook X Pro
ASUS|Vivobook Pro 15 OLED
Lenovo|IdeaPad Slim 5
HP|Pavilion Plus 14
Dell|Inspiron 14 Plus
Microsoft|Surface Laptop Go 3
Acer|Chromebook Spin 714
Lenovo|Chromebook Duet 5
`,
	Tablets: `
Apple|iPad Pro 11-inch M4
Apple|iPad Pro 13-inch M4
Apple|iPad Air 11-inch M2
Apple|iPad Air 13-inch M2
Apple|iPad 10th generation
Apple|iPad mini 6
Samsung|Galaxy Tab S9 Ultra
Samsung|Galaxy Tab S9+
Samsung|Galaxy Tab S9
Samsung|Galaxy Tab S9 FE+
Samsung|Galaxy Tab S9 FE
Samsung|Galaxy Tab A9+
Microsoft|Surface Pro 9
Microsoft|Surface Pro 10 for Business
Microsoft|Surface Go 4
Lenovo|Tab P12
Lenovo|Tab P11 Pro Gen 2
Lenovo|Yoga Tab 13
OnePlus|OnePlus Pad
Google|Pixel Tablet
Amazon|Fire Max 11
Amazon|Fire HD 10
Xiaomi|Pad 6
Xiaomi|Pad 6S Pro 12.4
Huawei|MatePad Pro 13.2
Huawei|MatePad 11.5
Honor|Pad 9
TCL|NXTPAPER 11
reMarkable|reMarkable 2
Kobo|Elipsa 2E
Boox|Note Air3 C
Boox|Tab Ultra C Pro
Wacom|One 13 Touch
XP-Pen|Magic Drawing Pad
ASUS|ROG Flow Z13
Samsung|Galaxy Tab Active5
Lenovo|Legion Tab
Nokia|T21
Dell|Latitude 7350 Detachable
HP|Elite x2 G8
Apple|iPad Pro 12.9-inch M2
Apple|iPad Air 5th generation
Samsung|Galaxy Tab S8 Ultra
Samsung|Galaxy Tab S8+
Samsung|Galaxy Tab S8
Lenovo|Tab M11
Amazon|Fire 7
Amazon|Fire HD 8 Plus
Microsoft|Surface Pro 8
Xiaomi|Redmi Pad Pro
`,
	Smartwatches: `
Apple|Watch Series 9 45mm
Apple|Watch Series 9 41mm
Apple|Watch Ultra 2
Apple|Watch SE 2nd generation
Apple|Watch Nike SE
Samsung|Galaxy Watch6 Classic 47mm
Samsung|Galaxy Watch6 Classic 43mm
Samsung|Galaxy Watch6 44mm
Samsung|Galaxy Watch6 40mm
Samsung|Galaxy Watch5 Pro
Google|Pixel Watch 2
Garmin|Fenix 7 Pro
Garmin|Epix Pro Gen 2
Garmin|Forerunner 965
Garmin|Forerunner 265
Garmin|Forerunner 165
Garmin|Venu 3
Garmin|Vivoactive 5
Garmin|Instinct 2X Solar
Fitbit|Sense 2
Fitbit|Versa 4
Fitbit|Charge 6
Fitbit|Inspire 3
Amazfit|GTR 4
Amazfit|GTS 4
Amazfit|Balance
Amazfit|T-Rex Ultra
Withings|ScanWatch 2
Withings|ScanWatch Light
Huawei|Watch GT 4
Huawei|Watch 4 Pro
Mobvoi|TicWatch Pro 5
Fossil|Gen 6
Citizen|CZ Smart
Suunto|Race
Suunto|9 Peak Pro
Polar|Vantage V3
Polar|Ignite 3
Casio|G-Shock Move DWH5600
Garmin|Lily 2
Garmin|Approach S70
Coros|Pace 3
Coros|Apex 2 Pro
Xiaomi|Watch 2 Pro
Xiaomi|Redmi Watch 4
OnePlus|Watch 2
Samsung|Galaxy Fit3
Fitbit|Luxe
Garmin|Enduro 2
TAG Heuer|Connected Calibre E4
`,
	Headphones: `
Sony|WH-1000XM5
Sony|WH-1000XM4
Sony|WF-1000XM5
Sony|WF-C700N
Sony|LinkBuds S
Bose|QuietComfort Ultra Headphones
Bose|QuietComfort Ultra Earbuds
Bose|QuietComfort Headphones
Bose|QuietComfort Earbuds II
Apple|AirPods Pro 2
Apple|AirPods 3
Apple|AirPods Max
Beats|Studio Pro
Beats|Fit Pro
Beats|Solo 4
Sennheiser|Momentum 4 Wireless
Sennheiser|Momentum True Wireless 4
Sennheiser|Accentum Plus Wireless
Sennheiser|HD 660S2
Audio-Technica|ATH-M50xBT2
Audio-Technica|ATH-M20xBT
Bowers & Wilkins|Px8
Bowers & Wilkins|Px7 S2e
Bowers & Wilkins|PI7 S2
Bang & Olufsen|Beoplay HX
Bang & Olufsen|Beoplay EX
JBL|Tour One M2
JBL|Live 770NC
JBL|Live Pro 2
JBL|Tune 720BT
Anker|Soundcore Space One
Anker|Soundcore Liberty 4 NC
Anker|Soundcore Space A40
Jabra|Elite 10
Jabra|Elite 8 Active
Jabra|Elite 4
Shokz|OpenRun Pro
Shokz|OpenFit
Shokz|OpenComm2
Razer|BlackShark V2 Pro
Logitech|G Pro X 2 Lightspeed
SteelSeries|Arctis Nova Pro Wireless
HyperX|Cloud III Wireless
Corsair|HS80 Max
Marshall|Major IV
Marshall|Motif II ANC
Nothing|Ear (2)
Google|Pixel Buds Pro
Samsung|Galaxy Buds2 Pro
Samsung|Galaxy Buds FE
`,
	Gaming: `
Sony|PlayStation 5 Slim Disc Edition
Sony|PlayStation 5 Digital Edition
Sony|PlayStation Portal Remote Player
Sony|DualSense Wireless Controller
Sony|DualSense Edge Controller
Microsoft|Xbox Series X
Microsoft|Xbox Series S 1TB
Microsoft|Xbox Wireless Controller
Microsoft|Xbox Elite Wireless Controller Series 2
Nintendo|Switch OLED
Nintendo|Switch Lite
Nintendo|Switch Pro Controller
Valve|Steam Deck OLED 512GB
Valve|Steam Deck OLED 1TB
ASUS|ROG Ally Z1 Extreme
Lenovo|Legion Go
Logitech|G Cloud
Meta|Quest 3
Meta|Quest 2
Backbone|One USB-C
Razer|Kishi V2
Elgato|Stream Deck MK.2
Elgato|HD60 X
Logitech|G923 Racing Wheel
Thrustmaster|T300 RS GT
Turtle Beach|VelocityOne Flight
Razer|Huntsman V3 Pro
SteelSeries|Apex Pro TKL Wireless
Corsair|K70 RGB Pro
Logitech|G915 TKL
Razer|DeathAdder V3 Pro
Logitech|G Pro X Superlight 2
SteelSeries|Aerox 5 Wireless
Elgato|Wave:3
Blue|Yeti X
NVIDIA|GeForce RTX 4070 Super
NVIDIA|GeForce RTX 4080 Super
AMD|Radeon RX 7900 XTX
ASUS|TUF Gaming GeForce RTX 4070 Ti
MSI|GeForce RTX 4060 Gaming X
Sony|PlayStation VR2
Nintendo|Switch Joy-Con Pair
8BitDo|Ultimate Controller
Analogue|Pocket
AYN|Odin 2 Pro
Razer|Wolverine V2 Pro
Samsung|990 Pro Heatsink for PS5
WD_BLACK|SN850P for PS5
Seagate|Storage Expansion Card for Xbox 1TB
Corsair|Virtuoso RGB Wireless XT
`,
	Monitors: `
Dell|UltraSharp U2723QE 27-inch 4K USB-C Monitor
Dell|UltraSharp U3223QE 32-inch 4K USB-C Monitor
Dell|P2723QE 27-inch 4K Monitor
Alienware|AW3423DWF 34-inch QD-OLED Monitor
Alienware|AW2725DF 27-inch QD-OLED Monitor
LG|UltraGear 27GR95QE-B 27-inch OLED Monitor
LG|UltraFine 32UN880-B 32-inch Ergo Monitor
LG|DualUp 28MQ780-B Monitor
LG|UltraWide 34WN80C-B Monitor
Samsung|Odyssey Neo G9 49-inch Monitor
Samsung|Odyssey OLED G8 34-inch Monitor
Samsung|Smart Monitor M8 32-inch
Samsung|ViewFinity S9 27-inch 5K Monitor
ASUS|ProArt Display PA279CV
ASUS|ProArt PA32UCR-K
ASUS|ROG Swift OLED PG27AQDM
ASUS|TUF Gaming VG27AQ
BenQ|PD3220U Designer Monitor
BenQ|MOBIUZ EX2710Q
BenQ|SW271C PhotoVue
Acer|Predator X27U OLED
Acer|Nitro XV272U
MSI|MAG 274QRF QD E2
MSI|MPG 321URX QD-OLED
Gigabyte|M32U
Gigabyte|M27Q X
HP|E27m G4 QHD USB-C Monitor
HP|Z27k G3 4K Monitor
Lenovo|ThinkVision P27h-30
Lenovo|Legion Y32p-30
ViewSonic|VP2768a
ViewSonic|Elite XG270QG
Philips|Brilliance 499P9H
Philips|Evnia 34M2C8600
AOC|Agon Pro AG276QZD
AOC|CQ32G3SE
Eizo|ColorEdge CS2740
Eizo|FlexScan EV2795
Apple|Studio Display 27-inch
Apple|Pro Display XDR 32-inch
Corsair|Xeneon 27QHD240 OLED
Corsair|Xeneon Flex 45WQHD240
INNOCN|27M2V Mini LED Monitor
NZXT|Canvas 27Q
Cooler Master|Tempest GP27U
ASUS|ZenScreen MB16AC
Lenovo|ThinkVision M14d
Dell|C2422HE Video Conferencing Monitor
Samsung|The Frame LS03B 32-inch
LG|24QP500-B 24-inch QHD Monitor
`,
	Accessories: `
Apple|MagSafe Charger
Apple|35W Dual USB-C Power Adapter
Apple|USB-C to Lightning Cable
Apple|Magic Keyboard with Touch ID
Apple|Magic Mouse
Apple|Magic Trackpad
Anker|737 Power Bank
Anker|735 Charger 65W
Anker|747 Charger 150W
Anker|565 USB-C Hub
Belkin|BoostCharge Pro 3-in-1 MagSafe Charger
Belkin|Thunderbolt 4 Dock Pro
CalDigit|TS4 Thunderbolt Dock
Satechi|USB-C Multiport Adapter V2
UGREEN|Nexode 100W USB-C Charger
UGREEN|Revodok Pro 13-in-1 Dock
Logitech|MX Master 3S
Logitech|MX Keys S
Logitech|MX Anywhere 3S
Microsoft|Surface Arc Mouse
Razer|Basilisk V3
Keychron|K2 Pro Wireless Keyboard
Keychron|Q1 Pro
Elgato|Key Light Air
Elgato|Facecam MK.2
Insta360|Link 4K Webcam
Logitech|Brio 4K Webcam
Twelve South|Curve Flex Stand
Nomad|Base One Max
Spigen|Ultra Hybrid MagFit Case
OtterBox|Defender Series Case
Peak Design|Everyday Case
Samsung|SmartTag2
Apple|AirTag 4 Pack
Tile|Pro 2 Pack
Amazon|Echo Dot 5th Gen
Google|Nest Hub 2nd Gen
Philips Hue|Bridge
Philips Hue|Play Light Bar
Nanoleaf|Shapes Starter Kit
Sonos|Roam
Sonos|Era 100
Bose|SoundLink Flex
JBL|Flip 6
Rode|Wireless GO II
Shure|MV7 USB Microphone
Blue|Yeti USB Microphone
Wacom|Intuos Small Bluetooth
Logitech|Litra Glow
DJI|Mic 2
`,
	Cameras: `
Sony|Alpha 7 IV
Sony|Alpha 7R V
Sony|Alpha 7C II
Sony|Alpha 6700
Sony|ZV-E10
Sony|ZV-1 II
Sony|RX100 VII
Canon|EOS R6 Mark II
Canon|EOS R5
Canon|EOS R8
Canon|EOS R7
Canon|EOS R50
Canon|PowerShot V10
Nikon|Z8
Nikon|Z7 II
Nikon|Z6 II
Nikon|Zf
Nikon|Z50
Fujifilm|X-T5
Fujifilm|X-H2S
Fujifilm|X-S20
Fujifilm|X100VI
Fujifilm|GFX 100S II
Panasonic|Lumix GH6
Panasonic|Lumix S5IIX
Panasonic|Lumix G9II
Panasonic|Lumix LX100 II
OM System|OM-1 Mark II
OM System|OM-5
Ricoh|GR IIIx
Leica|Q3
Leica|D-Lux 7
Hasselblad|X2D 100C
GoPro|HERO12 Black
GoPro|MAX
DJI|Osmo Pocket 3
DJI|Action 4
DJI|Mini 4 Pro
DJI|Air 3
Insta360|X4
Insta360|GO 3S
Insta360|Ace Pro
Blackmagic|Pocket Cinema Camera 6K Pro
Blackmagic|Cinema Camera 6K
Canon|XA75 Professional Camcorder
Sony|FX30 Cinema Line
Sony|FX3 Cinema Line
Nikon|Z30 Creator Kit
Fujifilm|Instax Mini 12
Polaroid|Now+ Generation 2
`,
	Storage: `
Samsung|990 Pro NVMe SSD
Samsung|990 Evo NVMe SSD
Samsung|980 Pro NVMe SSD
Samsung|T9 Portable SSD
Samsung|T7 Shield Portable SSD
WD_BLACK|SN850X NVMe SSD
WD_BLACK|SN770 NVMe SSD
Western Digital|WD Blue SN580 NVMe SSD
Western Digital|My Passport SSD
Western Digital|My Book Desktop Drive
SanDisk|Extreme Portable SSD V2
SanDisk|Extreme Pro Portable SSD
SanDisk|Ultra Dual Drive Luxe USB-C
SanDisk Professional|G-Drive ArmorATD
Crucial|T500 NVMe SSD
Crucial|P3 Plus NVMe SSD
Crucial|X9 Pro Portable SSD
Crucial|X10 Pro Portable SSD
Seagate|FireCuda 530 NVMe SSD
Seagate|FireCuda 540 PCIe Gen5 SSD
Seagate|Expansion Portable Drive
Seagate|One Touch Hub
Seagate|Backup Plus Slim
Kingston|KC3000 NVMe SSD
Kingston|NV2 NVMe SSD
Kingston|XS1000 External SSD
Kingston|DataTraveler Max USB-C
Lexar|NM790 NVMe SSD
Lexar|SL500 Portable SSD
Lexar|Professional 2000x SDXC Card
Corsair|MP600 Pro LPX
Corsair|MP700 Pro SSD
Sabrent|Rocket 4 Plus
Sabrent|Rocket 5 SSD
SK hynix|Platinum P41 SSD
SK hynix|Gold P31 SSD
PNY|XLR8 CS3140 SSD
PNY|Pro Elite V2 Portable SSD
LaCie|Rugged SSD Pro
LaCie|Mobile Drive
OWC|Envoy Pro FX
OWC|Aura Pro X2
Transcend|StoreJet 25M3
Transcend|JetDrive Lite 330
Teamgroup|T-Force Cardea A440 Pro
Silicon Power|UD90 NVMe SSD
ADATA|Legend 960 Max SSD
ADATA|SE880 External SSD
Mushkin|Vortex Redline SSD
Sabrent|Thunderbolt 3 Dual NVMe Dock
`,
} satisfies Record<CategoryName, string>;

const CATEGORY_COPY = {
	Phones: {
		noun: "smartphone",
		highlights: [
			"5G-ready performance",
			"sharp display for daily apps and media",
			"modern camera system for photos and video",
		],
		warranty:
			"Includes a 1-year limited manufacturer warranty with standard phone support.",
	},
	Laptops: {
		noun: "laptop",
		highlights: [
			"fast SSD storage for responsive workflows",
			"portable chassis for work, school, and travel",
			"balanced performance for productivity and creative apps",
		],
		warranty:
			"Includes a 1-year limited manufacturer warranty for parts and labor.",
	},
	Tablets: {
		noun: "tablet",
		highlights: [
			"touch-first design for streaming, note taking, and browsing",
			"lightweight build for mobile use",
			"accessory-friendly setup for keyboards and styluses",
		],
		warranty:
			"Includes a 1-year limited manufacturer warranty with tablet support.",
	},
	Smartwatches: {
		noun: "smartwatch",
		highlights: [
			"daily activity and notification tracking",
			"comfortable wearable design",
			"health, fitness, and app features for everyday use",
		],
		warranty:
			"Includes a 1-year limited manufacturer warranty for smartwatch hardware.",
	},
	Headphones: {
		noun: "audio product",
		highlights: [
			"wireless listening for music, calls, and travel",
			"comfortable fit for extended sessions",
			"tuned sound profile from a recognized audio brand",
		],
		warranty:
			"Includes a 1-year limited manufacturer warranty for audio hardware.",
	},
	Gaming: {
		noun: "gaming product",
		highlights: [
			"responsive hardware for play and streaming",
			"recognizable gaming ecosystem compatibility",
			"built for repeat use with modern games and accessories",
		],
		warranty:
			"Includes a 1-year limited manufacturer warranty for gaming hardware.",
	},
	Monitors: {
		noun: "monitor",
		highlights: [
			"crisp panel for productivity, media, and gaming",
			"modern inputs for laptops and desktops",
			"desk-ready design with adjustable viewing options",
		],
		warranty:
			"Includes a 1-year limited manufacturer warranty for display hardware.",
	},
	Accessories: {
		noun: "tech accessory",
		highlights: [
			"useful add-on for everyday devices",
			"compact design for desk, travel, or home setups",
			"compatible with common modern tech workflows",
		],
		warranty:
			"Includes a 1-year limited manufacturer warranty for accessory defects.",
	},
	Cameras: {
		noun: "camera product",
		highlights: [
			"reliable imaging hardware for stills and video",
			"creator-friendly controls and connectivity",
			"recognized camera ecosystem support",
		],
		warranty:
			"Includes a 1-year limited manufacturer warranty for camera hardware.",
	},
	Storage: {
		noun: "storage device",
		highlights: [
			"fast storage for backups, games, photos, and project files",
			"trusted drive family from a recognized storage brand",
			"capacity options for portable and desktop workflows",
		],
		warranty:
			"Includes a 1-year limited manufacturer warranty for storage hardware.",
	},
} satisfies Record<
	CategoryName,
	{ noun: string; highlights: string[]; warranty: string }
>;

const CATEGORY_COLOR_NAMES = {
	Phones: [
		"Black",
		"White",
		"Blue",
		"Natural Titanium",
		"Desert Titanium",
		"Green",
		"Pink",
	],
	Laptops: ["Silver", "Space Gray", "Midnight", "Black", "Blue", "Gold"],
	Tablets: ["Silver", "Space Gray", "Blue", "Purple", "Gold", "Pink"],
	Smartwatches: ["Black", "Silver", "Gold", "Blue", "Green", "Cream"],
	Headphones: ["Black", "White", "Silver", "Blue", "Cream", "Graphite"],
	Gaming: ["Black", "White", "Red", "Blue", "Graphite", "Purple"],
	Monitors: ["Black", "Silver", "White", "Graphite", "Platinum"],
	Accessories: ["Black", "White", "Silver", "Blue", "Graphite", "Red"],
	Cameras: ["Black", "Silver", "Graphite", "White", "Blue"],
	Storage: ["Black", "Silver", "Blue", "Red", "Graphite", "White"],
} satisfies Record<CategoryName, string[]>;

const CATEGORY_STORAGE_VALUES = {
	Phones: [128, 256, 512, 1024, 256],
	Laptops: [256, 512, 1024, 2048, 4096],
	Tablets: [64, 128, 256, 512, 1024],
	Gaming: [512, 1024, 2048, 512, 1024],
	Storage: [256, 512, 1024, 2048, 4096],
} satisfies Partial<Record<CategoryName, number[]>>;

const CATEGORY_RAM_VALUES = {
	Phones: [6, 8, 8, 12, 12],
	Laptops: [8, 16, 16, 32, 64],
	Tablets: [4, 8, 8, 12, 16],
	Gaming: [16, 16, 24, 32, 32],
} satisfies Partial<Record<CategoryName, number[]>>;

const PRICE_RANGES = {
	Phones: { min: 349, max: 1499 },
	Laptops: { min: 699, max: 3499 },
	Tablets: { min: 199, max: 1599 },
	Smartwatches: { min: 129, max: 899 },
	Headphones: { min: 49, max: 699 },
	Gaming: { min: 39, max: 1399 },
	Monitors: { min: 149, max: 4999 },
	Accessories: { min: 19, max: 399 },
	Cameras: { min: 99, max: 6999 },
	Storage: { min: 29, max: 899 },
} satisfies Record<CategoryName, { min: number; max: number }>;

type CategoryRow = {
	id: string;
	name: string;
	slug: string;
};

type ColorRow = {
	id: string;
	name: string;
	hexCode: string | null;
};

type StorageRow = {
	id: string;
	name: string;
	valueGb: number;
};

type RamRow = {
	id: string;
	name: string;
	valueGb: number;
};

type ScreenSizeRow = {
	id: string;
	name: string;
	valueInches: string;
};

type ProductRow = {
	id: string;
	slug: string;
};

type GeneratedVariantSeed = {
	sku: string;
	price: number;
	compareAtPrice: number | null;
	stockQuantity: number;
	colorName: string;
	storageValueGb: number | null;
	ramValueGb: number | null;
	screenValueInches: number | null;
	isDefault: boolean;
	images: string[];
};

type GeneratedProductSeed = {
	categoryName: CategoryName;
	name: string;
	brand: string;
	slug: string;
	shortDescription: string;
	description: string;
	warrantyInfo: string;
	image: string;
	isFeatured: boolean;
	isBestseller: boolean;
	isActive: boolean;
	variants: GeneratedVariantSeed[];
};

type OptionMaps = {
	colorByName: Map<string, ColorRow>;
	storageByValueGb: Map<number, StorageRow>;
	ramByValueGb: Map<number, RamRow>;
	screenByValueInches: Map<number, ScreenSizeRow>;
};

type VariantInsertCandidate = {
	sku: string;
	images: string[];
	row: typeof variant.$inferInsert;
};

const chunkArray = <T>(items: T[], size: number): T[][] => {
	const chunks: T[][] = [];

	for (let index = 0; index < items.length; index += size) {
		chunks.push(items.slice(index, index + size));
	}

	return chunks;
};

const stripHex = (value: string) => value.replace("#", "");

const hashString = (value: string) => {
	let hash = 2166136261;

	for (let index = 0; index < value.length; index += 1) {
		hash ^= value.charCodeAt(index);
		hash = Math.imul(hash, 16777619);
	}

	return hash >>> 0;
};

const escapeHtml = (value: string) =>
	value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");

const slugify = (value: string) =>
	value
		.toLowerCase()
		.trim()
		.replace(/\+/g, " plus ")
		.replace(/&/g, " and ")
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");

const makeSku = (slug: string, variantIndex: number) => {
	const body = slug
		.toUpperCase()
		.replace(/[^A-Z0-9]+/g, "-")
		.replace(/^-|-$/g, "")
		.slice(0, 44);
	const hash = hashString(slug).toString(36).toUpperCase().slice(0, 5);

	return `TS-${body}-${hash}-${variantIndex + 1}`;
};

const buildImageUrl = ({
	label,
	background,
	foreground = "#111827",
}: {
	label: string;
	background: string;
	foreground?: string;
}) =>
	`https://placehold.co/900x900/${stripHex(background)}/${stripHex(
		foreground,
	)}/png?text=${encodeURIComponent(label)}`;

const isDarkHex = (hexCode: string) => {
	const normalized = stripHex(hexCode);
	const red = Number.parseInt(normalized.slice(0, 2), 16);
	const green = Number.parseInt(normalized.slice(2, 4), 16);
	const blue = Number.parseInt(normalized.slice(4, 6), 16);

	return red * 0.299 + green * 0.587 + blue * 0.114 < 150;
};

const pickRotating = <T>(items: readonly T[], offset: number) =>
	items[offset % items.length] as T;

const roundPrice = (value: number) =>
	Number(Math.max(9.99, Math.round(value / 10) * 10 - 0.01).toFixed(2));

const storagePriceAdjustment = (
	categoryName: CategoryName,
	storageValueGb: number | null,
) => {
	if (storageValueGb === null) return 0;

	if (categoryName === "Storage") {
		return Math.max(0, storageValueGb - 256) * 0.08;
	}

	if (categoryName === "Laptops") {
		return Math.max(0, storageValueGb - 256) * 0.12;
	}

	if (categoryName === "Gaming") {
		return Math.max(0, storageValueGb - 512) * 0.08;
	}

	return Math.max(0, storageValueGb - 128) * 0.16;
};

const ramPriceAdjustment = (ramValueGb: number | null) => {
	if (ramValueGb === null) return 0;

	return Math.max(0, ramValueGb - 8) * 22;
};

const buildPrice = ({
	categoryName,
	brand,
	name,
	variantIndex,
	storageValueGb,
	ramValueGb,
}: {
	categoryName: CategoryName;
	brand: string;
	name: string;
	variantIndex: number;
	storageValueGb: number | null;
	ramValueGb: number | null;
}) => {
	const range = PRICE_RANGES[categoryName];
	const seed = hashString(`${categoryName}:${brand}:${name}`);
	const spread = range.max - range.min;
	const base = range.min + (seed % Math.max(1, Math.floor(spread * 0.55)));
	const optionPrice =
		storagePriceAdjustment(categoryName, storageValueGb) +
		ramPriceAdjustment(ramValueGb) +
		variantIndex * 8;

	return roundPrice(Math.min(range.max, base + optionPrice));
};

const buildCompareAtPrice = (price: number, sku: string) => {
	const seed = hashString(sku);

	if (seed % 4 !== 0) {
		return null;
	}

	return roundPrice(price + Math.max(10, price * (0.08 + (seed % 8) / 100)));
};

const buildStockQuantity = (sku: string) => {
	const seed = hashString(sku);

	if (seed % 23 === 0) {
		return 0;
	}

	return 8 + (seed % 118);
};

const lineItemsForCategory = (categoryName: CategoryName) =>
	PRODUCT_SEED_TEXT[categoryName]
		.trim()
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean);

const parseProductLine = (line: string) => {
	const separatorIndex = line.indexOf("|");

	if (separatorIndex === -1) {
		throw badRequestError(`Invalid catalog seed line: ${line}`);
	}

	const brand = line.slice(0, separatorIndex).trim();
	const name = line.slice(separatorIndex + 1).trim();

	if (brand.length === 0 || name.length === 0) {
		throw badRequestError(`Invalid catalog seed line: ${line}`);
	}

	return { brand, name };
};

const extractScreenSizeFromName = (name: string) => {
	const match = name.match(/(\d+(?:\.\d+)?)\s*-?inch/i);

	if (!match) {
		return null;
	}

	return Number(match[1]);
};

const inferScreenSize = (categoryName: CategoryName, name: string) => {
	const explicit = extractScreenSizeFromName(name);

	if (explicit !== null) {
		return explicit;
	}

	if (categoryName === "Phones") {
		if (/fold|open/i.test(name)) return 7.6;
		if (/ultra/i.test(name)) return 6.8;
		if (/plus|max|flip|pro/i.test(name)) return 6.7;
		if (/se/i.test(name)) return 4.7;
		return 6.1;
	}

	if (categoryName === "Laptops") {
		if (/17/i.test(name)) return 17.0;
		if (/16/i.test(name)) return 16.0;
		if (/15/i.test(name)) return 15.6;
		if (/14/i.test(name)) return 14.0;
		return 13.6;
	}

	if (categoryName === "Tablets") {
		if (/13|13\.2/i.test(name)) return 13.0;
		if (/12\.9/i.test(name)) return 12.9;
		if (/12\.4/i.test(name)) return 12.4;
		if (/11/i.test(name)) return 11.0;
		if (/mini|8/i.test(name)) return 8.3;
		return 10.9;
	}

	if (categoryName === "Smartwatches") {
		if (/47|45|ultra|pro/i.test(name)) return 1.5;
		if (/41|40|mini|light/i.test(name)) return 1.3;
		return 1.4;
	}

	if (categoryName === "Gaming") {
		if (/legion go/i.test(name)) return 8.8;
		if (/steam deck|rog ally|switch|portal|g cloud|pocket|odin/i.test(name)) {
			return 7.0;
		}
	}

	return null;
};

const isGamingDeviceWithStorage = (name: string) =>
	/playstation 5|xbox series|switch|steam deck|rog ally|legion go|g cloud|quest|pocket|odin|sn850p|expansion card|990 pro/i.test(
		name,
	);

const supportsStorage = (categoryName: CategoryName, name: string) =>
	categoryName in CATEGORY_STORAGE_VALUES &&
	(categoryName !== "Gaming" || isGamingDeviceWithStorage(name));

const supportsRam = (categoryName: CategoryName, name: string) =>
	categoryName in CATEGORY_RAM_VALUES &&
	(categoryName !== "Gaming" ||
		/steam deck|rog ally|legion go|g cloud/i.test(name));

const supportsScreen = (categoryName: CategoryName, name: string) =>
	categoryName === "Phones" ||
	categoryName === "Laptops" ||
	categoryName === "Tablets" ||
	categoryName === "Smartwatches" ||
	categoryName === "Monitors" ||
	(categoryName === "Gaming" && inferScreenSize(categoryName, name) !== null);

const buildDescription = ({
	brand,
	name,
	categoryName,
}: {
	brand: string;
	name: string;
	categoryName: CategoryName;
}) => {
	const copy = CATEGORY_COPY[categoryName];
	const fullName = `${brand} ${name}`;
	const highlights = copy.highlights
		.map((highlight) => `<li>${escapeHtml(highlight)}</li>`)
		.join("");

	return `<h2>${escapeHtml(fullName)}</h2><p>${escapeHtml(
		fullName,
	)} is seeded admin catalog data for a realistic ${escapeHtml(
		copy.noun,
	)} listing. It is designed for storefront browsing, filtering, and variant management tests.</p><ul>${highlights}</ul><p>Images are generated static URLs for development catalog display and are not copied from retailer product pages.</p>`;
};

const buildVariantImages = ({
	productImage,
	brand,
	name,
	colorName,
	colorHex,
	sku,
	optionLabel,
}: {
	productImage: string;
	brand: string;
	name: string;
	colorName: string;
	colorHex: string;
	sku: string;
	optionLabel: string;
}) => {
	const foreground = isDarkHex(colorHex) ? "#FFFFFF" : "#111827";
	const images = [
		productImage,
		buildImageUrl({
			label: `${brand}\n${name}\n${colorName}`,
			background: colorHex,
			foreground,
		}),
		buildImageUrl({
			label: `${sku}\n${optionLabel}`,
			background: "#F8FAFC",
			foreground: "#111827",
		}),
	];
	const imageCount = 1 + (hashString(sku) % 3);

	return images.slice(0, imageCount);
};

const buildOptionLabel = ({
	colorName,
	storageValueGb,
	ramValueGb,
	screenValueInches,
}: {
	colorName: string;
	storageValueGb: number | null;
	ramValueGb: number | null;
	screenValueInches: number | null;
}) =>
	[
		colorName,
		storageValueGb === null ? null : `${storageValueGb}GB`,
		ramValueGb === null ? null : `${ramValueGb}GB RAM`,
		screenValueInches === null ? null : `${screenValueInches.toFixed(1)}in`,
	]
		.filter(Boolean)
		.join(" / ");

const buildVariantsForProduct = ({
	brand,
	name,
	slug,
	categoryName,
	productImage,
	productIndex,
}: {
	brand: string;
	name: string;
	slug: string;
	categoryName: CategoryName;
	productImage: string;
	productIndex: number;
}): GeneratedVariantSeed[] => {
	const colors = CATEGORY_COLOR_NAMES[categoryName];
	const storageValues = CATEGORY_STORAGE_VALUES[categoryName] ?? [];
	const ramValues = CATEGORY_RAM_VALUES[categoryName] ?? [];
	const screenValueInches = supportsScreen(categoryName, name)
		? inferScreenSize(categoryName, name)
		: null;
	const offset = hashString(slug);

	return Array.from({ length: VARIANTS_PER_PRODUCT }, (_, variantIndex) => {
		const colorName = pickRotating(colors, offset + variantIndex);
		const colorHex =
			COLOR_SEEDS.find((item) => item.name === colorName)?.hexCode ?? "#F8FAFC";
		const storageValueGb =
			supportsStorage(categoryName, name) && storageValues.length > 0
				? pickRotating(storageValues, productIndex + variantIndex)
				: null;
		const ramValueGb =
			supportsRam(categoryName, name) && ramValues.length > 0
				? pickRotating(ramValues, productIndex + variantIndex)
				: null;
		const sku = makeSku(slug, variantIndex);
		const price = buildPrice({
			categoryName,
			brand,
			name,
			variantIndex,
			storageValueGb,
			ramValueGb,
		});
		const optionLabel = buildOptionLabel({
			colorName,
			storageValueGb,
			ramValueGb,
			screenValueInches,
		});

		return {
			sku,
			price,
			compareAtPrice: buildCompareAtPrice(price, sku),
			stockQuantity: buildStockQuantity(sku),
			colorName,
			storageValueGb,
			ramValueGb,
			screenValueInches,
			isDefault: variantIndex === 0,
			images: buildVariantImages({
				productImage,
				brand,
				name,
				colorName,
				colorHex,
				sku,
				optionLabel,
			}),
		};
	});
};

const buildProductSeeds = (): GeneratedProductSeed[] => {
	const products: GeneratedProductSeed[] = [];

	for (const categorySeed of CATEGORY_SEEDS) {
		const lines = lineItemsForCategory(categorySeed.name);

		for (const line of lines) {
			const { brand, name } = parseProductLine(line);
			const productIndex = products.length;
			const slug = slugify(`${brand}-${name}`);
			const image = buildImageUrl({
				label: `${brand}\n${name}`,
				background: categorySeed.imageBg,
			});
			const categoryCopy = CATEGORY_COPY[categorySeed.name];
			const seedHash = hashString(`${categorySeed.name}:${brand}:${name}`);

			products.push({
				categoryName: categorySeed.name,
				name,
				brand,
				slug,
				shortDescription: `${brand} ${name} configured as a realistic ${categoryCopy.noun} catalog listing.`,
				description: buildDescription({
					brand,
					name,
					categoryName: categorySeed.name,
				}),
				warrantyInfo: categoryCopy.warranty,
				image,
				isFeatured: seedHash % 9 === 0,
				isBestseller: seedHash % 7 === 0,
				isActive: true,
				variants: buildVariantsForProduct({
					brand,
					name,
					slug,
					categoryName: categorySeed.name,
					productImage: image,
					productIndex,
				}),
			});
		}
	}

	if (products.length < MINIMUM_SEED_PRODUCTS) {
		throw badRequestError(
			`Catalog seed generator produced ${products.length} products; at least ${MINIMUM_SEED_PRODUCTS} are required.`,
		);
	}

	return products.slice(0, MINIMUM_SEED_PRODUCTS);
};

const loadCategoryRows = async () => {
	const names = CATEGORY_SEEDS.map((item) => item.name);
	const slugs = CATEGORY_SEEDS.map((item) => item.slug);

	return db
		.select({
			id: category.id,
			name: category.name,
			slug: category.slug,
		})
		.from(category)
		.where(or(inArray(category.name, names), inArray(category.slug, slugs)));
};

const ensureCategories = async () => {
	const existingRows = await loadCategoryRows();
	const existingNames = new Set(existingRows.map((row) => row.name));
	const existingSlugs = new Set(existingRows.map((row) => row.slug));
	const rowsToCreate = CATEGORY_SEEDS.filter(
		(seed) => !existingNames.has(seed.name) && !existingSlugs.has(seed.slug),
	).map((seed) => ({
		name: seed.name,
		slug: seed.slug,
		icon: seed.icon,
		iconColor: seed.iconColor,
		iconBg: seed.iconBg,
	}));
	let categoriesCreated = 0;

	for (const batch of chunkArray(rowsToCreate, INSERT_BATCH_SIZE)) {
		const inserted = await db
			.insert(category)
			.values(batch)
			.onConflictDoNothing()
			.returning({ id: category.id });
		categoriesCreated += inserted.length;
	}

	const allRows = await loadCategoryRows();
	const categoryByName = new Map<string, CategoryRow>();

	for (const seed of CATEGORY_SEEDS) {
		const row =
			allRows.find((item) => item.name === seed.name) ??
			allRows.find((item) => item.slug === seed.slug);

		if (!row) {
			throw badRequestError(`Category is missing after seed: ${seed.name}`);
		}

		categoryByName.set(seed.name, row);
	}

	return { categoriesCreated, categoryByName };
};

const loadColorRows = async () => {
	const names = COLOR_SEEDS.map((item) => item.name);
	const hexCodes = COLOR_SEEDS.map((item) => item.hexCode);

	return db
		.select({
			id: color.id,
			name: color.name,
			hexCode: color.hexCode,
		})
		.from(color)
		.where(or(inArray(color.name, names), inArray(color.hexCode, hexCodes)));
};

const ensureColors = async () => {
	const existingRows = await loadColorRows();
	const existingNames = new Set(existingRows.map((row) => row.name));
	const existingHexCodes = new Set(
		existingRows.map((row) => row.hexCode).filter((value) => value !== null),
	);
	const rowsToCreate = COLOR_SEEDS.filter(
		(seed) =>
			!existingNames.has(seed.name) && !existingHexCodes.has(seed.hexCode),
	);
	let created = 0;

	for (const batch of chunkArray(rowsToCreate, INSERT_BATCH_SIZE)) {
		const inserted = await db
			.insert(color)
			.values(batch)
			.onConflictDoNothing()
			.returning({ id: color.id });
		created += inserted.length;
	}

	const allRows = await loadColorRows();
	const byName = new Map<string, ColorRow>();

	for (const seed of COLOR_SEEDS) {
		const row =
			allRows.find((item) => item.name === seed.name) ??
			allRows.find((item) => item.hexCode === seed.hexCode);

		if (!row) {
			throw badRequestError(`Color option is missing after seed: ${seed.name}`);
		}

		byName.set(seed.name, row);
	}

	return { created, byName };
};

const loadStorageRows = async () => {
	const names = STORAGE_SEEDS.map((item) => item.name);
	const values = STORAGE_SEEDS.map((item) => item.valueGb);

	return db
		.select({
			id: storage.id,
			name: storage.name,
			valueGb: storage.valueGb,
		})
		.from(storage)
		.where(or(inArray(storage.name, names), inArray(storage.valueGb, values)));
};

const ensureStorages = async () => {
	const existingRows = await loadStorageRows();
	const existingNames = new Set(existingRows.map((row) => row.name));
	const existingValues = new Set(existingRows.map((row) => row.valueGb));
	const rowsToCreate = STORAGE_SEEDS.filter(
		(seed) =>
			!existingNames.has(seed.name) && !existingValues.has(seed.valueGb),
	);
	let created = 0;

	for (const batch of chunkArray(rowsToCreate, INSERT_BATCH_SIZE)) {
		const inserted = await db
			.insert(storage)
			.values(batch)
			.onConflictDoNothing()
			.returning({ id: storage.id });
		created += inserted.length;
	}

	const allRows = await loadStorageRows();
	const byValueGb = new Map<number, StorageRow>();

	for (const seed of STORAGE_SEEDS) {
		const row =
			allRows.find((item) => item.valueGb === seed.valueGb) ??
			allRows.find((item) => item.name === seed.name);

		if (!row) {
			throw badRequestError(
				`Storage option is missing after seed: ${seed.name}`,
			);
		}

		byValueGb.set(seed.valueGb, row);
	}

	return { created, byValueGb };
};

const loadRamRows = async () => {
	const names = RAM_SEEDS.map((item) => item.name);
	const values = RAM_SEEDS.map((item) => item.valueGb);

	return db
		.select({
			id: ram.id,
			name: ram.name,
			valueGb: ram.valueGb,
		})
		.from(ram)
		.where(or(inArray(ram.name, names), inArray(ram.valueGb, values)));
};

const ensureRams = async () => {
	const existingRows = await loadRamRows();
	const existingNames = new Set(existingRows.map((row) => row.name));
	const existingValues = new Set(existingRows.map((row) => row.valueGb));
	const rowsToCreate = RAM_SEEDS.filter(
		(seed) =>
			!existingNames.has(seed.name) && !existingValues.has(seed.valueGb),
	);
	let created = 0;

	for (const batch of chunkArray(rowsToCreate, INSERT_BATCH_SIZE)) {
		const inserted = await db
			.insert(ram)
			.values(batch)
			.onConflictDoNothing()
			.returning({ id: ram.id });
		created += inserted.length;
	}

	const allRows = await loadRamRows();
	const byValueGb = new Map<number, RamRow>();

	for (const seed of RAM_SEEDS) {
		const row =
			allRows.find((item) => item.valueGb === seed.valueGb) ??
			allRows.find((item) => item.name === seed.name);

		if (!row) {
			throw badRequestError(`RAM option is missing after seed: ${seed.name}`);
		}

		byValueGb.set(seed.valueGb, row);
	}

	return { created, byValueGb };
};

const loadScreenRows = async () => {
	const names = SCREEN_SIZE_SEEDS.map((item) => item.name);
	const values = SCREEN_SIZE_SEEDS.map((item) => item.valueInches.toFixed(1));

	return db
		.select({
			id: screenSize.id,
			name: screenSize.name,
			valueInches: screenSize.valueInches,
		})
		.from(screenSize)
		.where(
			or(
				inArray(screenSize.name, names),
				inArray(screenSize.valueInches, values),
			),
		);
};

const ensureScreens = async () => {
	const existingRows = await loadScreenRows();
	const existingNames = new Set(existingRows.map((row) => row.name));
	const existingValues = new Set(
		existingRows.map((row) => Number(row.valueInches)),
	);
	const rowsToCreate = SCREEN_SIZE_SEEDS.filter(
		(seed) =>
			!existingNames.has(seed.name) && !existingValues.has(seed.valueInches),
	).map((seed) => ({
		name: seed.name,
		valueInches: seed.valueInches.toFixed(1),
	}));
	let created = 0;

	for (const batch of chunkArray(rowsToCreate, INSERT_BATCH_SIZE)) {
		const inserted = await db
			.insert(screenSize)
			.values(batch)
			.onConflictDoNothing()
			.returning({ id: screenSize.id });
		created += inserted.length;
	}

	const allRows = await loadScreenRows();
	const byValueInches = new Map<number, ScreenSizeRow>();

	for (const seed of SCREEN_SIZE_SEEDS) {
		const row =
			allRows.find((item) => Number(item.valueInches) === seed.valueInches) ??
			allRows.find((item) => item.name === seed.name);

		if (!row) {
			throw badRequestError(
				`Screen size option is missing after seed: ${seed.name}`,
			);
		}

		byValueInches.set(seed.valueInches, row);
	}

	return { created, byValueInches };
};

const ensureOptions = async (): Promise<{
	optionsCreated: number;
	optionMaps: OptionMaps;
}> => {
	const [colors, storages, rams, screens] = await Promise.all([
		ensureColors(),
		ensureStorages(),
		ensureRams(),
		ensureScreens(),
	]);

	return {
		optionsCreated:
			colors.created + storages.created + rams.created + screens.created,
		optionMaps: {
			colorByName: colors.byName,
			storageByValueGb: storages.byValueGb,
			ramByValueGb: rams.byValueGb,
			screenByValueInches: screens.byValueInches,
		},
	};
};

const loadProductsBySlug = async (slugs: string[]) => {
	const rows: ProductRow[] = [];

	for (const batch of chunkArray(slugs, INSERT_BATCH_SIZE)) {
		rows.push(
			...(await db
				.select({
					id: product.id,
					slug: product.slug,
				})
				.from(product)
				.where(inArray(product.slug, batch))),
		);
	}

	return rows;
};

const seedProducts = async ({
	productSeeds,
	categoryByName,
}: {
	productSeeds: GeneratedProductSeed[];
	categoryByName: Map<string, CategoryRow>;
}) => {
	const slugs = productSeeds.map((item) => item.slug);
	const existingRows = await loadProductsBySlug(slugs);
	const existingSlugs = new Set(existingRows.map((row) => row.slug));
	const rowsToCreate = productSeeds
		.filter((seed) => !existingSlugs.has(seed.slug))
		.map((seed) => {
			const categoryRow = categoryByName.get(seed.categoryName);

			if (!categoryRow) {
				throw badRequestError(`Category not available: ${seed.categoryName}`);
			}

			const parsed = createProductSchema.parse({
				categoryId: categoryRow.id,
				name: seed.name,
				brand: seed.brand,
				slug: seed.slug,
				shortDescription: seed.shortDescription,
				description: seed.description,
				warrantyInfo: seed.warrantyInfo,
				image: seed.image,
				isFeatured: seed.isFeatured,
				isBestseller: seed.isBestseller,
				isActive: seed.isActive,
			});

			return parsed;
		});
	let productsCreated = 0;

	for (const batch of chunkArray(rowsToCreate, INSERT_BATCH_SIZE)) {
		const inserted = await db
			.insert(product)
			.values(batch)
			.onConflictDoNothing()
			.returning({ id: product.id });
		productsCreated += inserted.length;
	}

	const allRows = await loadProductsBySlug(slugs);
	const productBySlug = new Map<string, ProductRow>();

	for (const seed of productSeeds) {
		const row = allRows.find((item) => item.slug === seed.slug);

		if (!row) {
			throw badRequestError(`Product is missing after seed: ${seed.slug}`);
		}

		productBySlug.set(seed.slug, row);
	}

	return {
		productsCreated,
		skippedProducts: productSeeds.length - productsCreated,
		productBySlug,
	};
};

const loadExistingVariantSkus = async (skus: string[]) => {
	const rows: { sku: string }[] = [];

	for (const batch of chunkArray(skus, INSERT_BATCH_SIZE)) {
		rows.push(
			...(await db
				.select({ sku: variant.sku })
				.from(variant)
				.where(inArray(variant.sku, batch))),
		);
	}

	return new Set(rows.map((row) => row.sku));
};

const loadVariantDefaultState = async (productIds: string[]) => {
	const productHasDefault = new Map<string, boolean>();

	for (const productId of productIds) {
		productHasDefault.set(productId, false);
	}

	for (const batch of chunkArray(productIds, INSERT_BATCH_SIZE)) {
		const rows = await db
			.select({
				productId: variant.productId,
				isDefault: variant.isDefault,
			})
			.from(variant)
			.where(inArray(variant.productId, batch));

		for (const row of rows) {
			if (row.isDefault) {
				productHasDefault.set(row.productId, true);
			}
		}
	}

	return productHasDefault;
};

const resolveRequiredOptionId = <T extends { id: string }>(
	row: T | undefined,
	message: string,
) => {
	if (!row) {
		throw badRequestError(message);
	}

	return row.id;
};

const resolveOptionalOptionId = <T extends { id: string }>(
	row: T | undefined,
	message: string,
) => {
	if (!row) {
		throw badRequestError(message);
	}

	return row.id;
};

const buildVariantInsertCandidates = ({
	productSeeds,
	productBySlug,
	optionMaps,
	existingSkus,
	productHasDefault,
}: {
	productSeeds: GeneratedProductSeed[];
	productBySlug: Map<string, ProductRow>;
	optionMaps: OptionMaps;
	existingSkus: Set<string>;
	productHasDefault: Map<string, boolean>;
}) => {
	const candidates: VariantInsertCandidate[] = [];

	for (const productSeed of productSeeds) {
		const productRow = productBySlug.get(productSeed.slug);

		if (!productRow) {
			throw badRequestError(`Product not available: ${productSeed.slug}`);
		}

		for (const variantSeed of productSeed.variants) {
			if (existingSkus.has(variantSeed.sku)) {
				continue;
			}

			const colorId = resolveRequiredOptionId(
				optionMaps.colorByName.get(variantSeed.colorName),
				`Color option not available: ${variantSeed.colorName}`,
			);
			const storageId =
				variantSeed.storageValueGb === null
					? null
					: resolveOptionalOptionId(
							optionMaps.storageByValueGb.get(variantSeed.storageValueGb),
							`Storage option not available: ${variantSeed.storageValueGb}GB`,
						);
			const ramId =
				variantSeed.ramValueGb === null
					? null
					: resolveOptionalOptionId(
							optionMaps.ramByValueGb.get(variantSeed.ramValueGb),
							`RAM option not available: ${variantSeed.ramValueGb}GB`,
						);
			const screenSizeId =
				variantSeed.screenValueInches === null
					? null
					: resolveOptionalOptionId(
							optionMaps.screenByValueInches.get(variantSeed.screenValueInches),
							`Screen size option not available: ${variantSeed.screenValueInches}`,
						);
			const parsed = createVariantSchema.parse({
				productId: productRow.id,
				sku: variantSeed.sku,
				price: variantSeed.price,
				compareAtPrice: variantSeed.compareAtPrice,
				stockQuantity: variantSeed.stockQuantity,
				colorId,
				storageId,
				ramId,
				screenSizeId,
				isDefault:
					variantSeed.isDefault && !productHasDefault.get(productRow.id),
				images: variantSeed.images,
			});

			candidates.push({
				sku: parsed.sku,
				images: parsed.images,
				row: {
					productId: parsed.productId,
					sku: parsed.sku,
					price: parsed.price.toString(),
					compareAtPrice:
						parsed.compareAtPrice == null
							? null
							: parsed.compareAtPrice.toString(),
					stockQuantity: parsed.stockQuantity,
					colorId: parsed.colorId ?? null,
					storageId: parsed.storageId ?? null,
					ramId: parsed.ramId ?? null,
					screenSizeId: parsed.screenSizeId ?? null,
					isDefault: parsed.isDefault,
				},
			});
		}
	}

	return candidates;
};

const insertVariantImages = async (
	imageRows: (typeof variantImage.$inferInsert)[],
) => {
	for (const batch of chunkArray(imageRows, IMAGE_INSERT_BATCH_SIZE)) {
		await db.insert(variantImage).values(batch);
	}
};

const seedVariants = async ({
	productSeeds,
	productBySlug,
	optionMaps,
}: {
	productSeeds: GeneratedProductSeed[];
	productBySlug: Map<string, ProductRow>;
	optionMaps: OptionMaps;
}) => {
	const allVariantSeeds = productSeeds.flatMap((seed) => seed.variants);
	const existingSkus = await loadExistingVariantSkus(
		allVariantSeeds.map((seed) => seed.sku),
	);
	const productIds = Array.from(productBySlug.values()).map((row) => row.id);
	const productHasDefault = await loadVariantDefaultState(productIds);
	const candidates = buildVariantInsertCandidates({
		productSeeds,
		productBySlug,
		optionMaps,
		existingSkus,
		productHasDefault,
	});
	const candidateBySku = new Map(
		candidates.map((candidate) => [candidate.sku, candidate]),
	);
	let variantsCreated = 0;

	for (const batch of chunkArray(candidates, INSERT_BATCH_SIZE)) {
		const inserted = await db
			.insert(variant)
			.values(batch.map((candidate) => candidate.row))
			.onConflictDoNothing()
			.returning({
				id: variant.id,
				sku: variant.sku,
			});
		variantsCreated += inserted.length;

		const imageRows = inserted.flatMap((row) => {
			const candidate = candidateBySku.get(row.sku);

			if (!candidate) {
				return [];
			}

			return candidate.images.map((image, imageIndex) => ({
				variantId: row.id,
				image,
				sortOrder: imageIndex,
			}));
		});

		await insertVariantImages(imageRows);
	}

	return {
		variantsCreated,
		skippedVariants: allVariantSeeds.length - variantsCreated,
	};
};

export const seedCatalog = async (): Promise<JsonOk<SeedCatalogOutputType>> => {
	try {
		const productSeeds = buildProductSeeds();
		const { categoriesCreated, categoryByName } = await ensureCategories();
		const { optionsCreated, optionMaps } = await ensureOptions();
		const { productsCreated, skippedProducts, productBySlug } =
			await seedProducts({
				productSeeds,
				categoryByName,
			});
		const { variantsCreated, skippedVariants } = await seedVariants({
			productSeeds,
			productBySlug,
			optionMaps,
		});
		const summary: SeedCatalogSummaryType = seedCatalogSummarySchema.parse({
			categoriesCreated,
			optionsCreated,
			productsCreated,
			variantsCreated,
			skippedProducts,
			skippedVariants,
		});

		return jsonOk<SeedCatalogOutputType>({
			status: HttpStatusCode.OK,
			message: "Catalog seed completed successfully",
			data: summary,
		});
	} catch (error) {
		throw handleError(error);
	}
};
