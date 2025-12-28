import { Atom, Dumbbell, BarChart3, MoreHorizontal, Star, Timer, GraduationCap, Dice5, Dna, Microscope, FlaskConical, Hammer, ArrowRightLeft, Ruler, Leaf, Recycle, Camera, Car, DollarSign, Briefcase, Utensils, ChefHat, Heart, Calculator, Percent, User, Calendar } from 'lucide-react';

export const categoryPagesData = {
    physics: {
        title: "Physics Calculators",
        icon: Atom,
        subtitle: "530 calculators",
        description: "The well-known American author, Bill Bryson, once said: “Physics is really nothing more than a search for ultimate simplicity, but so far all we have is a kind of elegant messiness.” Physics is indeed the most fundamental of the sciences that tries to describe the whole nature with thousands of mathematical formulas. How not to get lost in all...",
        sections: [
            {
                title: "Kinematics calculators — How things move",
                icon: Timer,
                iconColor: "#a16207",
                groups: [
                    [
                        { label: "Arrow Speed Calculator", url: "#" },
                        { label: "Ballistic Coefficient Calculator", url: "#" },
                        { label: "Car Jump Distance Calculator", url: "#" },
                    ],
                    [
                        { label: "Momentum Calculator", url: "#" },
                        { label: "Muzzle Velocity Calculator", url: "#" },
                        { label: "Polar Moment of Inertia Calculator", url: "#" },
                    ]
                ]
            }
        ]
    },
    sports: {
        title: "Sports Calculators",
        icon: Dumbbell,
        subtitle: "109 calculators",
        description: "Are you an amateur sportsperson? Maybe a professional athlete? Even if you do sport only occasionally, the category sports calculators is the area dedicated to you! We serve suited runners calculators, cycling calculators, as well as more calculators for other disciplines and sport-related topics. Want to know how good was the last season...",
        sections: [
            {
                title: "Baseball calculators",
                emoji: "⚾",
                groups: [
                    [
                        { label: "Batting Average Calculator", url: "/sports/batting-average-calculator" },
                        { label: "ERA Calculator – Earned Run Average", url: "/sports/era-calculator" },
                        { label: "Fielding Percentage Calculator", url: "/sports/fielding-percentage-calculator" },
                    ],
                    [
                        { label: "On Base Percentage Calculator", url: "/sports/on-base-percentage-calculator" },
                        { label: "Slugging Percentage Calculator", url: "/sports/slugging-percentage-calculator" },
                        { label: "WAR Calculator (Wins Above Replacement)", url: "/sports/war-calculator" },
                    ]
                ]
            }
        ]
    },
    statistics: {
        title: "Statistics Calculators",
        icon: BarChart3,
        subtitle: "191 calculators",
        description: "What are the chances of winning the lottery? What is the risk of doing this? How many times do I have to roll a dice to get the number I want? All these questions are statistics problems. We provide simple statistics calculators to help you make better decisions and solve problems faster. From the odds calculator to the probability calculator, you'll...",
        sections: [
            {
                title: "Probability theory and odds calculators",
                icon: Dice5,
                iconColor: "#a16207",
                groups: [
                    [
                        { label: "Accuracy Calculator", url: "/statistics/accuracy-calculator" },
                        { label: "ANOVA Calculator", url: "/statistics/anova-calculator" },
                        { label: "Bayes' Theorem Calculator", url: "/statistics/bayes-theorem-calculator", icon: "share-2" },
                    ],
                    [
                        { label: "Lottery Calculator", url: "/statistics/lottery-calculator", icon: "ticket" },
                        { label: "Implied Probability Calculator", url: "/statistics/implied-probability-calculator" },
                        { label: "Joint Probability Calculator", url: "/statistics/joint-probability-calculator" },
                    ]
                ]
            }
        ]
    },
    other: {
        title: "Other Calculators",
        icon: MoreHorizontal,
        subtitle: "193 calculators",
        description: "Congratulations, you just found the most random collection of calculators available on the Internet! Are you a hardcore geek? We’ll help you pick a motor for your drone. A travel junkie? Use our calculator to choose the optimal sunscreen SPF for holidays in Bali. A keen photographer? We’ll help you plan out a perfect star time lapse. A student...",
        sections: [
            {
                title: "Education calculators",
                icon: GraduationCap,
                iconColor: "#a16207",
                groups: [
                    [
                        { label: "ACT Score Calculator", url: "/other/act-score-calculator" },
                        { label: "Semester Grade Calculator", url: "/other/semester-grade-calculator" },
                        { label: "PTE Score Calculator", url: "/other/pte-score-calculator" },
                        { label: "Test Grade Calculator", url: "/other/test-grade-calculator" },
                    ],
                    [
                        { label: "GWA Calculator – General Weighted Average", url: "/other/gwa-calculator" },
                        { label: "High School GPA Calculator", url: "/other/high-school-gpa-calculator" },
                        { label: "IELTS Score Calculator", url: "/other/ielts-score-calculator" },
                    ]
                ]
            }
        ]
    },
    "discover-omni": {
        title: "Discover Omni",
        icon: Star,
        iconFill: "white",
        subtitle: "41 calculators",
        description: "We proudly present the collection of the most unique, crazy, knock-your-socks-off calculators on the Web! Here, you can discover Omni Calculator in its full glory, and get the full perspective on what we do and why. Trying to relax? Grab a sweet tea prepared with our chilled drink calculator, or lift up in the air on helium balloons. Hungry? We have...",
        sections: [
            {
                groups: [
                    [
                        { label: "Addiction Calculator", url: "/discover-omni/addiction-calculator", icon: "💊" },
                        { label: "Vampire Apocalypse Calculator", url: "/discover-omni/vampire-apocalypse-calculator", icon: "🧛" },
                        { label: "Alien Civilization Calculator", url: "/discover-omni/alien-civilization-calculator", icon: "👽" },
                        { label: "Black Friday Calculator", url: "/discover-omni/black-friday-calculator" },
                        { label: "Black Hole Collision Calculator", url: "#" },
                        { label: "Harris-Benedict Calculator (Basal Metabolic Rate)", url: "#" },
                    ],
                    [
                        { label: "Ideal Egg Boiling Calculator", url: "/discover-omni/ideal-egg-boiling-calculator" },
                        { label: "Korean Age Calculator", url: "/discover-omni/korean-age-calculator" },
                        { label: "Lost Socks Calculator", url: "#" },
                        { label: "Meat Footprint Calculator", url: "/ecology/meat-footprint-calculator" },
                    ]
                ]
            }
        ]
    },
    biology: {
        title: "Biology Calculators",
        icon: Dna,
        subtitle: "105 calculators",
        description: "This collection is a surprise even for us – it turns out that even in the science of life, there are lots of things to calculate! Here, you can find calculators for gardeners, farmers, pet owners, scientists, and nature enthusiasts! Do you need to know how many plants you need to create an organized and dense flower bed? Our mulch calculator...",
        sections: [
            {
                title: "Bio laboratory calculators",
                emoji: "🔬",
                groups: [
                    [
                        { label: "Annealing Temperature Calculator", url: "/biology/annealing-temperature-calculator" },
                        { label: "Generation Time Calculator", url: "#" },
                        { label: "Cell Dilution Calculator", url: "#" },
                    ],
                    [
                        { label: "DNA Concentration Calculator", url: "#" },
                        { label: "Ligation Calculator", url: "#" },
                        { label: "Log Reduction Calculator", url: "#" },
                    ]
                ]
            }
        ]
    },
    chemistry: {
        title: "Chemistry Calculators",
        icon: FlaskConical,
        subtitle: "102 calculators",
        description: "Chemistry might seem intimidating and counterintuitive at first, but it is also extremely useful. So how can you learn everything about chemistry without effort? We don't know the answer, but we can help you solve chemistry problems faster and more efficiently thanks to our chemistry calculators. From calculating concentrations to using...",
        sections: [
            {
                title: "General chemistry calculators",
                icon: Atom,
                iconColor: "#a855f7",
                groups: [
                    [
                        { label: "Atom Calculator", url: "/chemistry/atom-calculator" },
                        { label: "Atomic Mass Calculator", url: "/chemistry/atomic-mass-calculator" },
                        { label: "Average Atomic Mass Calculator", url: "/chemistry/average-atomic-mass-calculator" },
                    ],
                    [
                        { label: "Electron Configuration Calculator", url: "/chemistry/electron-configuration-calculator" },
                        { label: "Electronegativity Calculator", url: "/chemistry/electronegativity-calculator" },
                        { label: "Molar Mass Calculator", url: "/chemistry/molar-mass-calculator" },
                    ]
                ]
            }
        ]
    },
    construction: {
        title: "Construction Calculators",
        icon: Hammer,
        subtitle: "153 calculators",
        description: "Whether you're renovating a house, planning out a swimming pool, or removing snow from your roof, we've got you covered. These online construction calculators were created specifically for carpenters, painters, bricklayers, roofers, and craftsmen alike who switch back and forth between square feet of driveways and pounds of cement on an...",
        sections: [
            {
                title: "Construction converters",
                emoji: "👷",
                groups: [
                    [
                        { label: "Board Foot Calculator", url: "#" },
                        { label: "Cubic Yard Calculator", url: "#" },
                        { label: "Gallons per Square Foot Calculator", url: "#" },
                    ],
                    [
                        { label: "Square Feet to Cubic Yards Calculator", url: "#" },
                        { label: "Square Footage Calculator", url: "/construction/square-footage-calculator" },
                        { label: "Square Yards Calculator", url: "#" },
                    ]
                ]
            }
        ]
    },
    conversion: {
        title: "Conversion Calculators",
        icon: ArrowRightLeft,
        subtitle: "318 calculators",
        description: "We all use length, weight, temperature, time, speed, and various other quantities in everyday life. But they aren't just plain numbers - they all have corresponding units. Moreover, the multitude of metric systems such as the International System of Units (SI) or the United States customary units (USC) complicates the situation even more. I...",
        sections: [
            {
                title: "Length and area converters",
                icon: Ruler,
                iconColor: "#9ca3af",
                groups: [
                    [
                        { label: "Acreage Calculator", url: "/conversion/acreage-calculator" },
                        { label: "Area Converter", url: "/conversion/area-converter" },
                        { label: "Ares to hectares converter", url: "/conversion/ares-to-hectares-converter" },
                    ],
                    [
                        { label: "Height in Inches Calculator", url: "/conversion/height-in-inches-calculator" },
                        { label: "Inches to Fraction Calculator", url: "/conversion/inches-to-fraction-calculator" },
                        { label: "Length Converter", url: "/conversion/length-converter" },
                    ]
                ]
            }
        ]
    },
    ecology: {
        title: "Ecology Calculators",
        icon: Leaf,
        subtitle: "34 calculators",
        description: "You may think that this category is only for vegans, ecologists or nature lovers, but nothing could be further from the truth. Climate change and environmental degradation are one of the biggest threats of our times, which will affect each and every person. With these simple calculators, we're trying to increase the environmental awareness of the...",
        sections: [
            {
                title: "Eco footprint calculators",
                icon: Recycle,
                iconColor: "#10b981",
                groups: [
                    [
                        { label: "AI Water Footprint Calculator", url: "#" },
                        { label: "Bag Footprint Calculator", url: "#" },
                        { label: "Christmas Tree Footprint Calculator", url: "#" },
                    ],
                    [
                        { label: "Hand Drying Footprint Calculator", url: "#" },
                        { label: "Kaya Identity Calculator", url: "#" },
                        { label: "Meat Footprint Calculator", url: "/ecology/meat-footprint-calculator" },
                    ]
                ]
            }
        ]
    },
    everyday_life: {
        title: "Everyday life Calculators",
        icon: Camera,
        subtitle: "270 calculators",
        description: "This unique collection of calculators gives you a hand in your everyday struggle of existence. We can help in finding the ways to save some money, with tools like our fuel cost calculator. We'll be on your side when you're racking your brain over commuting alternatives or planning with our time and date calculator. And when you're wasting your...",
        sections: [
            {
                title: "Transportation calculators",
                icon: Car,
                iconColor: "#f87171",
                groups: [
                    [
                        { label: "0-60 Calculator", url: "/everyday-life/0-60-calculator" },
                        { label: "Miles per Year Calculator", url: "/everyday-life/miles-per-year-calculator" },
                        { label: "Boat Speed Calculator", url: "/everyday-life/boat-speed-calculator" },
                    ],
                    [
                        { label: "Boost Horsepower Calculator", url: "/everyday-life/boost-horsepower-calculator" },
                        { label: "Miles to Dollars Calculator", url: "/everyday-life/miles-to-dollars-calculator" },
                        { label: "MPG Calculator", url: "/everyday-life/mpg-calculator" },
                    ]
                ]
            },
            {
                title: "Time and date calculators",
                icon: Calendar,
                iconColor: "#3b82f6",
                groups: [
                    [
                        { label: "Time Until Calculator", url: "/everyday-life/time-until-calculator" },
                    ]
                ]
            }
        ]
    },
    finance: {
        title: "Finance Calculators",
        icon: DollarSign,
        subtitle: "596 calculators",
        description: "It doesn't matter whether you are the CEO of Google, a venture capitalist, a stockbroker, an entrepreneur or a simple student - we all have to admit that this world revolves around money. Almost every human interaction has something to do with finances: buying in a shop, providing services, borrowing, even going on a date. Sometimes, w...",
        sections: [
            {
                title: "Business planning calculators",
                icon: Briefcase,
                iconColor: "#a16207",
                groups: [
                    [
                        { label: "3D Printer - Buy vs Outsource Calculator", url: "#" },
                        { label: "Absence Percentage Calculator", url: "#" },
                        { label: "Accumulated Depreciation Calculator", url: "#" },
                    ],
                    [
                        { label: "FIFO Calculator for Inventory", url: "#" },
                        { label: "Full-time Equivalent (FTE) Calculator", url: "#" },
                        { label: "GMROI Calculator — Gross Margin Return on Investment", url: "#" },
                    ]
                ]
            },
            {
                title: "Tax and salary Calculation",
                icon: DollarSign,
                iconColor: "#10b981",
                groups: [
                    [
                        { label: "Sales Tax Calculator", url: "/finance/sales-tax-calculator" },
                        { label: "Salary to Hourly Calculator", url: "/finance/salary-to-hourly-calculator" },
                        { label: "Margin Calculator", url: "/finance/margin-calculator" },
                    ]
                ]
            }
        ]
    },
    food: {
        title: "Food Calculators",
        icon: Utensils,
        subtitle: "69 calculators",
        description: "Food - naturally, the most essential (as well as controversial) part of our life. In this section, you can find calculators for food lovers, party organizers or calorie counting addicts, what perfectly reflects the complexity of feelings we have for the subject. Wondering if we have a pizza calculator? Nope - we have pizza calculators, plural! Check our...",
        sections: [
            {
                title: "Cooking converters",
                icon: ChefHat,
                iconColor: "#a16207",
                groups: [
                    [
                        { label: "Butter Calculator - How Much is a Stick of Butter?", url: "/food/butter-calculator" },
                        { label: "Cake Pan Converter", url: "/food/cake-pan-converter" },
                        { label: "Cooking Measurement Converter", url: "/food/cooking-measurement-converter" },
                    ],
                    [
                        { label: "Grams to Tablespoons Converter", url: "/food/grams-to-tablespoons-converter" },
                        { label: "Grams to Teaspoons Converter", url: "/food/grams-to-teaspoons-converter" },
                        { label: "ml to Grams Calculator", url: "/food/ml-to-grams-calculator" },
                    ]
                ]
            }
        ]
    },
    health: {
        title: "Health Calculators",
        icon: Heart,
        subtitle: "431 calculators",
        description: "Welcome to health calculators! Whether you are a doctor, a medical student or a patient, you will find answers to your medical questions here, as well as receive a lot of scientifically proven information. What is my renal function and what does it mean? How much blood do I have? How to dose medication to children? What is my risk of having...",
        sections: [
            {
                title: "Body measurements calculators",
                icon: Ruler,
                iconColor: "#a16207",
                groups: [
                    [
                        { label: "ABSI Calculator", url: "#" },
                        { label: "Adjusted Body Weight Calculator", url: "#" },
                        { label: "BAI Calculator - Body Adiposity Index", url: "#" },
                    ],
                    [
                        { label: "FFMI Calculator (Fat-Free Mass Index)", url: "#" },
                        { label: "Ideal Weight Calculator", url: "#" },
                        { label: "Karvonen Formula Calculator", url: "#" },
                    ]
                ]
            }
        ]
    },
    math: {
        title: "Math Calculators",
        icon: Calculator,
        subtitle: "671 calculators",
        description: "Math can be exciting and easier than you think! With our collection of maths calculators, everyone can perform and understand useful mathematical calculations in seconds. Are you scared of trigonometry? Do you think geometry is “too complicated”? Fear not! Omni Calculator has your back, with a comprehensive array of calculators designed s...",
        sections: [
            {
                title: "Percentages calculators",
                icon: Percent,
                iconColor: "#a16207",
                groups: [
                    [
                        { label: "Average Percentage Calculator", url: "/math/average-percentage-calculator" },
                        { label: "Fraction to Percent Calculator", url: "/math/fraction-to-percent-calculator" },
                        { label: "Decimal to Percent Converter", url: "/math/decimal-to-percent-converter" },
                    ],
                    [
                        { label: "Percentage Increase Calculator", url: "/math/percentage-increase-calculator" },
                        { label: "Percentage of a Percentage Calculator", url: "/math/percentage-of-percentage-calculator" },
                        { label: "Percentage Point Calculator", url: "/math/percentage-point-calculator" },
                    ]
                ]
            }
        ]
    }
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
