import { Atom, Dumbbell, BarChart3, MoreHorizontal, Star, Timer, GraduationCap, Dice5, Dna, Microscope, FlaskConical, Hammer, ArrowRightLeft, Ruler, Leaf, Recycle, Camera, Car, DollarSign, Briefcase, Utensils, ChefHat, Heart, Calculator, Percent, User, Calendar, Thermometer, Pipette, Link as LinkIcon, TrendingDown, Activity, Zap, RotateCw, Target, Shield, Footprints, Trophy, Ticket, GitBranch, Box, LayoutGrid, Droplets, ShoppingBag, TreePine, Globe, Sailboat, Rocket, BadgeDollarSign, Fuel, Wind, TrendingUp, Printer, UserX, ArrowDownUp, Users, BarChart4, Cookie, Circle, ConciergeBell, Scale, Divide, Award, Pill, Ghost, CircleDot } from 'lucide-react';





export const categoryPagesData = {
    physics: {
        title: "Physics Calculators",
        icon: Atom,
        layoutType: 'cards',
        subtitle: "6 calculators",
        description: "The well-known American author, Bill Bryson, once said: “Physics is really nothing more than a search for ultimate simplicity, but so far all we have is a kind of elegant messiness.” Physics is indeed the most fundamental of the sciences that tries to describe the whole nature with thousands of mathematical formulas.",
        sections: [
            {
                title: "Kinematics calculators — How things move",
                icon: Timer,
                iconColor: "#a16207",
                groups: [
                    [
                        { label: "Arrow Speed Calculator", url: "/physics/arrow-speed-calculator", icon: MoreHorizontal }, // Placeholder icon
                        { label: "Ballistic Coefficient Calculator", url: "/physics/ballistic-coefficient-calculator", icon: Rocket },
                        { label: "Quarter Mile Calculator", url: "/physics/quarter-mile-calculator", icon: Timer },
                    ],
                    [
                        { label: "Momentum Calculator", url: "/physics/momentum-calculator", icon: Activity },
                        { label: "Friction Calculator", url: "/physics/friction-calculator", icon: Zap },
                        { label: "Free Fall Calculator", url: "/physics/free-fall-calculator", icon: ArrowDownUp },
                    ]
                ]
            }
        ]
    },
    sports: {
        title: "Sports Calculators",
        icon: Dumbbell,
        layoutType: 'cards',
        subtitle: "6 calculators",
        description: "Are you an amateur sportsperson? Maybe a professional athlete? Even if you do sport only occasionally, the category sports calculators is the area dedicated to you! We serve suited runners calculators, cycling calculators, as well as more calculators for other disciplines and sport-related topics.",
        sections: [
            {
                title: "Baseball calculators",
                emoji: "⚾",
                groups: [
                    [
                        { label: "Batting Average Calculator", url: "/sports/batting-average-calculator", icon: Target },
                        { label: "ERA Calculator – Earned Run Average", url: "/sports/era-calculator", icon: TrendingDown },
                        { label: "Fielding Percentage Calculator", url: "/sports/fielding-percentage-calculator", icon: Shield },
                    ],
                    [
                        { label: "On Base Percentage Calculator", url: "/sports/on-base-percentage-calculator", icon: Footprints },
                        { label: "Slugging Percentage Calculator", url: "/sports/slugging-percentage-calculator", icon: Zap },
                        { label: "WAR Calculator (Wins Above Replacement)", url: "/sports/war-calculator", icon: Trophy },
                    ]
                ]
            }
        ]
    },
    statistics: {
        title: "Statistics Calculators",
        icon: BarChart3,
        layoutType: 'cards',
        subtitle: "6 calculators",
        description: "What are the chances of winning the lottery? What is the risk of doing this? How many times do I have to roll a dice to get the number I want? All these questions are statistics problems. We provide simple statistics calculators to help you make better decisions and solve problems faster.",
        sections: [
            {
                title: "Probability theory and odds calculators",
                icon: Dice5,
                iconColor: "#a16207",
                groups: [
                    [
                        { label: "Accuracy Calculator", url: "/statistics/accuracy-calculator", icon: Target },
                        { label: "ANOVA Calculator", url: "/statistics/anova-calculator", icon: BarChart3 },
                        { label: "Bayes' Theorem Calculator", url: "/statistics/bayes-theorem-calculator", icon: GitBranch },
                    ],
                    [
                        { label: "Lottery Calculator", url: "/statistics/lottery-calculator", icon: Ticket },
                        { label: "Implied Probability Calculator", url: "/statistics/implied-probability-calculator", icon: Percent },
                        { label: "Joint Probability Calculator", url: "/statistics/joint-probability-calculator", icon: MoreHorizontal },
                    ]
                ]
            }
        ]
    },
    other: {
        title: "Other Calculators",
        icon: MoreHorizontal,
        layoutType: 'cards',
        subtitle: "7 calculators",
        description: "Congratulations, you just found the most random collection of calculators available on the Internet! Are you a hardcore geek? We’ll help you pick a motor for your drone. A travel junkie? Use our calculator to choose the optimal sunscreen SPF for holidays in Bali. A keen photographer? We’ll help you plan out a perfect star time lapse.",
        sections: [
            {
                title: "Education calculators",
                icon: GraduationCap,
                iconColor: "#a16207",
                groups: [
                    [
                        { label: "ACT Score Calculator", url: "/other/act-score-calculator", icon: GraduationCap },
                        { label: "Semester Grade Calculator", url: "/other/semester-grade-calculator", icon: GraduationCap },
                        { label: "PTE Score Calculator", url: "/other/pte-score-calculator", icon: GraduationCap },
                        { label: "Test Grade Calculator", url: "/other/test-grade-calculator", icon: GraduationCap },
                    ],
                    [
                        { label: "GWA Calculator – General Weighted Average", url: "/other/gwa-calculator", icon: Award },
                        { label: "High School GPA Calculator", url: "/other/high-school-gpa-calculator", icon: Award },
                        { label: "IELTS Score Calculator", url: "/other/ielts-score-calculator", icon: GraduationCap },
                    ]
                ]
            }
        ]
    },
    "discover-omni": {
        title: "Discover Omni",
        icon: Star,
        iconFill: "white",
        layoutType: 'cards',
        subtitle: "6 calculators",
        description: "We proudly present the collection of the most unique, crazy, knock-your-socks-off calculators on the Web! Here, you can discover Omni Calculator in its full glory, and get the full perspective on what we do and why. Trying to relax? Grab a sweet tea prepared with our chilled drink calculator, or lift up in the air on helium balloons.",
        sections: [
            {
                groups: [
                    [
                        { label: "Addiction Calculator", url: "/discover-omni/addiction-calculator", icon: Pill },
                        { label: "Vampire Apocalypse Calculator", url: "/discover-omni/vampire-apocalypse-calculator", icon: Ghost },
                        { label: "Alien Civilization Calculator", url: "/discover-omni/alien-civilization-calculator", icon: Rocket },
                        { label: "Black Friday Calculator", url: "/discover-omni/black-friday-calculator", icon: ShoppingBag },
                        { label: "Black Hole Collision Calculator", url: "#", icon: CircleDot },
                        { label: "Harris-Benedict Calculator (Basal Metabolic Rate)", url: "#", icon: Activity },
                    ],
                    [
                        { label: "Ideal Egg Boiling Calculator", url: "/discover-omni/ideal-egg-boiling-calculator", icon: Timer },
                        { label: "Korean Age Calculator", url: "/discover-omni/korean-age-calculator", icon: Calendar },
                        { label: "Lost Socks Calculator", url: "#", icon: Footprints },
                        { label: "Meat Footprint Calculator", url: "/ecology/meat-footprint-calculator", icon: Utensils },
                    ]
                ]
            }
        ]
    },
    biology: {
        title: "Biology Calculators",
        icon: Dna,
        layoutType: 'cards',
        subtitle: "6 calculators",
        description: "This collection is a surprise even for us – it turns out that even in the science of life, there are lots of things to calculate! Here, you can find calculators for farmers, pet owners, scientists, and nature enthusiasts! Do you need to know how many plants you need to create an organized and dense flower bed?",
        sections: [
            {
                title: "Bio laboratory calculators",
                emoji: "🔬",
                groups: [
                    [
                        { label: "Annealing Temperature Calculator", url: "/biology/annealing-temperature-calculator", icon: Thermometer },
                        { label: "Generation Time Calculator", url: "/biology/generation-time-calculator", icon: Timer },
                        { label: "Cell Dilution Calculator", url: "/biology/cell-dilution-calculator", icon: Pipette },
                    ],
                    [
                        { label: "Cell Doubling Time Calculator", url: "/biology/cell-doubling-time-calculator", icon: Activity },
                        { label: "Ligation Calculator", url: "/biology/ligation-calculator", icon: LinkIcon },
                        { label: "Log Reduction Calculator", url: "/biology/log-reduction-calculator", icon: TrendingDown },
                    ]
                ]
            }
        ]
    },
    chemistry: {
        title: "Chemistry Calculators",
        icon: FlaskConical,
        layoutType: 'cards',
        subtitle: "6 calculators",
        description: "Chemistry might seem intimidating and counterintuitive at first, but it is also extremely useful. So how can you learn everything about chemistry without effort? We don't know the answer, but we can help you solve chemistry problems faster and more efficiently thanks to our chemistry calculators.",
        sections: [
            {
                title: "General chemistry calculators",
                icon: Atom,
                iconColor: "#a855f7",
                groups: [
                    [
                        { label: "Atom Calculator", url: "/chemistry/atom-calculator", icon: Atom },
                        { label: "Atomic Mass Calculator", url: "/chemistry/atomic-mass-calculator", icon: Microscope },
                        { label: "Average Atomic Mass Calculator", url: "/chemistry/average-atomic-mass-calculator", icon: Scale },
                    ],
                    [
                        { label: "Electron Configuration Calculator", url: "/chemistry/electron-configuration-calculator", icon: CircleDot },
                        { label: "Electronegativity Calculator", url: "/chemistry/electronegativity-calculator", icon: Zap },
                        { label: "Molar Mass Calculator", url: "/chemistry/molar-mass-calculator", icon: FlaskConical },
                    ]
                ]
            }
        ]
    },
    construction: {
        title: "Construction Calculators",
        icon: Hammer,
        layoutType: 'cards',
        subtitle: "6 calculators",
        description: "Whether you're renovating a house, planning out a swimming pool, or removing snow from your roof, we've got you covered. These online construction calculators were created specifically for carpenters, painters, bricklayers, roofers.",
        sections: [
            {
                title: "Construction converters",
                emoji: "👷",
                groups: [
                    [
                        { label: "Board Foot Calculator", url: "#", icon: Ruler },
                        { label: "Cubic Yard Calculator", url: "#", icon: Box },
                        { label: "Gallons per Square Foot Calculator", url: "#", icon: Droplets },
                    ],
                    [
                        { label: "Square Feet to Cubic Yards Calculator", url: "#", icon: Box },
                        { label: "Square Footage Calculator", url: "/construction/square-footage-calculator", icon: LayoutGrid },
                        { label: "Square Yards Calculator", url: "#", icon: LayoutGrid },
                    ]
                ]
            }
        ]
    },
    conversion: {
        title: "Conversion Calculators",
        icon: ArrowRightLeft,
        layoutType: 'cards',
        subtitle: "6 calculators",
        description: "We all use length, weight, temperature, time, speed, and various other quantities in everyday life. But they aren't just plain numbers - they all have corresponding units. Moreover, the multitude of metric systems such as the International System of Units (SI) or the United States customary units (USC) complicates the situation even more.",
        sections: [
            {
                title: "Length and area converters",
                icon: Ruler,
                iconColor: "#9ca3af",
                groups: [
                    [
                        { label: "Acreage Calculator", url: "/conversion/acreage-calculator", icon: LayoutGrid },
                        { label: "Area Converter", url: "/conversion/area-converter", icon: Box },
                        { label: "Ares to hectares converter", url: "/conversion/ares-to-hectares-converter", icon: TreePine },
                    ],
                    [
                        { label: "Height in Inches Calculator", url: "/conversion/height-in-inches-calculator", icon: Ruler },
                        { label: "Inches to Fraction Calculator", url: "/conversion/inches-to-fraction-calculator", icon: Divide },
                        { label: "Length Converter", url: "/conversion/length-converter", icon: ArrowRightLeft },
                    ]
                ]
            }
        ]
    },
    ecology: {
        title: "Ecology Calculators",
        icon: Leaf,
        layoutType: 'cards',
        subtitle: "6 calculators",
        description: "You may think that this category is only for vegans, ecologists or nature lovers, but nothing could be further from the truth. Climate change and environmental degradation are one of the biggest threats of our times, which will affect each and every person.",
        sections: [
            {
                title: "Eco footprint calculators",
                icon: Recycle,
                iconColor: "#10b981",
                groups: [
                    [
                        { label: "AI Water Footprint Calculator", url: "#", icon: Droplets },
                        { label: "Bag Footprint Calculator", url: "#", icon: ShoppingBag },
                        { label: "Christmas Tree Footprint Calculator", url: "#", icon: TreePine },
                    ],
                    [
                        { label: "Hand Drying Footprint Calculator", url: "#", icon: Wind },
                        { label: "Kaya Identity Calculator", url: "#", icon: Globe },
                        { label: "Meat Footprint Calculator", url: "/ecology/meat-footprint-calculator", icon: Utensils },
                    ]
                ]
            }
        ]
    },
    everyday_life: {
        title: "Everyday life Calculators",
        icon: Camera,
        layoutType: 'cards',
        subtitle: "7 calculators",
        description: "This unique collection of calculators gives you a hand in your everyday struggle of existence. We can help in finding the ways to save some money, with tools like our fuel cost calculator. We'll be on your side when you're racking your brain over commuting alternatives or planning with our time and date calculator.",
        sections: [
            {
                title: "Transportation calculators",
                icon: Car,
                iconColor: "#f87171",
                groups: [
                    [
                        { label: "0-60 Calculator", url: "/everyday-life/0-60-calculator", icon: Timer },
                        { label: "Miles per Year Calculator", url: "/everyday-life/miles-per-year-calculator", icon: Car },
                        { label: "Boat Speed Calculator", url: "/everyday-life/boat-speed-calculator", icon: Sailboat },
                    ],
                    [
                        { label: "Boost Horsepower Calculator", url: "/everyday-life/boost-horsepower-calculator", icon: Rocket },
                        { label: "Miles to Dollars Calculator", url: "/everyday-life/miles-to-dollars-calculator", icon: BadgeDollarSign },
                        { label: "MPG Calculator", url: "/everyday-life/mpg-calculator", icon: Fuel },
                    ]
                ]
            },
            {
                title: "Time and date calculators",
                icon: Calendar,
                iconColor: "#3b82f6",
                groups: [
                    [
                        { label: "Time Until Calculator", url: "/everyday-life/time-until-calculator", icon: Timer },
                    ]
                ]
            }
        ]
    },
    finance: {
        title: "Finance Calculators",
        icon: DollarSign,
        layoutType: 'cards',
        subtitle: "9 calculators",
        description: "It doesn't matter whether you are the CEO of Google, a venture capitalist, a stockbroker, an entrepreneur or a simple student - we all have to admit that this world revolves around money. Almost every human interaction has something to do with finances: buying in a shop, providing services, borrowing, even going on a date.",
        sections: [
            {
                title: "Business planning calculators",
                icon: Briefcase,
                iconColor: "#a16207",
                groups: [
                    [
                        { label: "3D Printer - Buy vs Outsource Calculator", url: "#", icon: Printer },
                        { label: "Absence Percentage Calculator", url: "#", icon: UserX },
                        { label: "Accumulated Depreciation Calculator", url: "#", icon: TrendingDown },
                    ],
                    [
                        { label: "FIFO Calculator for Inventory", url: "#", icon: ArrowDownUp },
                        { label: "Full-time Equivalent (FTE) Calculator", url: "#", icon: Users },
                        { label: "GMROI Calculator — Gross Margin Return on Investment", url: "#", icon: BarChart4 },
                    ]
                ]
            },
            {
                title: "Tax and salary Calculation",
                icon: DollarSign,
                iconColor: "#10b981",
                groups: [
                    [
                        { label: "Sales Tax Calculator", url: "/finance/sales-tax-calculator", icon: Percent },
                        { label: "Salary to Hourly Calculator", url: "/finance/salary-to-hourly-calculator", icon: BadgeDollarSign },
                        { label: "Margin Calculator", url: "/finance/margin-calculator", icon: TrendingUp },
                    ]
                ]
            }
        ]
    },
    food: {
        title: "Food Calculators",
        icon: Utensils,
        layoutType: 'cards',
        subtitle: "6 calculators",
        description: "Food - naturally, the most essential (as well as controversial) part of our life. In this section, you can find calculators for food lovers, party organizers or calorie counting addicts, what perfectly reflects the complexity of feelings we have for the subject. Wondering if we have a pizza calculator? Nope - we have pizza calculators, plural!",
        sections: [
            {
                title: "Cooking converters",
                icon: ChefHat,
                iconColor: "#a16207",
                groups: [
                    [
                        { label: "Butter Calculator - How Much is a Stick of Butter?", url: "/food/butter-calculator", icon: Cookie },
                        { label: "Cake Pan Converter", url: "/food/cake-pan-converter", icon: Circle },
                        { label: "Cooking Measurement Converter", url: "/food/cooking-measurement-converter", icon: ChefHat },
                    ],
                    [
                        { label: "Grams to Tablespoons Converter", url: "/food/grams-to-tablespoons-converter", icon: ConciergeBell },
                        { label: "Grams to Teaspoons Converter", url: "/food/grams-to-teaspoons-converter", icon: Utensils },
                        { label: "ml to Grams Calculator", url: "/food/ml-to-grams-calculator", icon: FlaskConical },
                    ]
                ]
            }
        ]
    },
    health: {
        title: "Health Calculators",
        icon: Heart,
        layoutType: 'cards',
        subtitle: "6 calculators",
        description: "Welcome to health calculators! Whether you are a doctor, a medical student or a patient, you will find answers to your medical questions here, as well as receive a lot of scientifically proven information. What is my renal function and what does it mean? How much blood do I have? How to dose medication to children?",
        sections: [
            {
                title: "Body measurements calculators",
                icon: Ruler,
                iconColor: "#a16207",
                groups: [
                    [
                        { label: "ABSI Calculator", url: "/health/absi-calculator", icon: Activity },
                        { label: "Adjusted Body Weight Calculator", url: "/health/adjusted-body-weight-calculator", icon: Scale },
                        { label: "BAI Calculator - Body Adiposity Index", url: "/health/bai-calculator", icon: Activity },
                    ],
                    [
                        { label: "FFMI Calculator (Fat-Free Mass Index)", url: "/health/ffmi-calculator", icon: Dumbbell },
                        { label: "Lean Body Mass Calculator", url: "/health/lean-body-mass-calculator", icon: Scale },
                        { label: "Karvonen Formula Calculator", url: "/health/karvonen-formula-calculator", icon: Heart },
                    ]
                ]
            }
        ]
    },
    math: {
        title: "Math Calculators",
        icon: Calculator,
        layoutType: 'cards',
        subtitle: "6 calculators",
        description: "Math can be exciting and easier than you think! With our collection of maths calculators, everyone can perform and understand useful mathematical calculations in seconds. Are you scared of trigonometry? Do you think geometry is “too complicated”? Fear not! Omni Calculator has your back.",
        sections: [
            {
                title: "Percentages calculators",
                icon: Percent,
                iconColor: "#a16207",
                groups: [
                    [
                        { label: "Average Percentage Calculator", url: "/math/average-percentage-calculator", icon: Percent },
                        { label: "Fraction to Percent Calculator", url: "/math/fraction-to-percent-calculator", icon: Divide },
                        { label: "Decimal to Percent Converter", url: "/math/decimal-to-percent-converter", icon: Percent },
                    ],
                    [
                        { label: "Percentage Increase Calculator", url: "/math/percentage-increase-calculator", icon: TrendingUp },
                        { label: "Percentage of a Percentage Calculator", url: "/math/percentage-of-percentage-calculator", icon: Percent },
                        { label: "Percentage Point Calculator", url: "/math/percentage-point-calculator", icon: Target },
                    ]
                ]
            }
        ]
    },
};

const deepFreeze = (obj) => {
    Object.keys(obj).forEach((prop) => {
        if (typeof obj[prop] === 'object' && obj[prop] !== null && !Object.isFrozen(obj[prop])) {
            deepFreeze(obj[prop]);
        }
    });
    return Object.freeze(obj);
};

deepFreeze(categoryPagesData);
