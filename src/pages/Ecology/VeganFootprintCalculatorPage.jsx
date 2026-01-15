import React, { useState } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { ChevronDown, MoreHorizontal } from 'lucide-react';
import InputGroup from '../../components/StandardCalculator/InputGroup';
import ResultRow from '../../components/StandardCalculator/ResultRow';
import ActionPanel from '../../components/StandardCalculator/ActionPanel';
import FeedbackRow from '../../components/StandardCalculator/FeedbackRow';
import '../../components/StandardCalculator/StandardCalculator.css';

const VeganFootprintCalculatorPage = () => {
    // --- State: Time Input ---
    const [timeUnit, setTimeUnit] = useState('days');
    const [isTimeUnitOpen, setIsTimeUnitOpen] = useState(false);

    // Composite Inputs
    const [years, setYears] = useState('');
    const [months, setMonths] = useState('');
    const [days, setDays] = useState('');

    // --- State: Output Units ---
    const [unitCO2, setUnitCO2] = useState('kg');
    const [unitForest, setUnitForest] = useState('m2');
    const [unitGrain, setUnitGrain] = useState('kg');
    const [unitWater, setUnitWater] = useState('l');

    // --- Constants ---
    const SAVINGS_PER_DAY = {
        animal: 1,
        co2: 9.07185,    // 20 lbs
        forest: 2.78709, // 30 sq ft
        grain: 18.1437,  // 40 lbs
        water: 4163.95   // 1100 gallons
    };

    const massUnits = ['g', 'dag', 'kg', 't', 'oz', 'lb'];
    const massFactors = {
        'g': 0.001, 'dag': 0.01, 'kg': 1, 't': 1000, 'oz': 0.0283495, 'lb': 0.453592
    };

    const areaUnits = ['m2', 'km2', 'ft2', 'yd2', 'mi2', 'a', 'da', 'ha', 'ac', 'sf'];
    const areaFactors = {
        'm2': 1, 'km2': 1000000, 'ft2': 0.092903, 'yd2': 0.836127, 'mi2': 2589988,
        'a': 100, 'da': 1000, 'ha': 10000, 'ac': 4046.86, 'sf': 7140
    };

    const volUnits = ['l', 'hl', 'US gal', 'UK gal'];
    const volFactors = {
        'l': 1, 'hl': 100, 'US gal': 3.78541, 'UK gal': 4.54609
    };

    // --- Calculation ---
    const getDays = () => {
        const val = parseFloat(days);
        if (isNaN(val) && timeUnit !== 'yrs / mos' && timeUnit !== 'yrs / mos / days') return 0;

        // Single unit modes
        if (timeUnit === 'days') return val || 0;
        if (timeUnit === 'wks') return (val || 0) * 7;
        if (timeUnit === 'mos') return (val || 0) * 30.4375;
        if (timeUnit === 'yrs') return (val || 0) * 365.25;

        // Composite modes
        const yVal = parseFloat(years) || 0;
        const mVal = parseFloat(months) || 0;
        const dVal = (timeUnit === 'yrs / mos / days') ? (parseFloat(days) || 0) : 0;

        return (yVal * 365.25) + (mVal * 30.4375) + dVal;
    };

    const totalDays = getDays();

    const resAnimal = totalDays * SAVINGS_PER_DAY.animal;
    const resCO2 = (totalDays * SAVINGS_PER_DAY.co2) / (massFactors[unitCO2] || 1);
    const resForest = (totalDays * SAVINGS_PER_DAY.forest) / (areaFactors[unitForest] || 1);
    const resGrain = (totalDays * SAVINGS_PER_DAY.grain) / (massFactors[unitGrain] || 1);
    const resWater = (totalDays * SAVINGS_PER_DAY.water) / (volFactors[unitWater] || 1);

    const format = (n) => {
        if (!n) return '0';
        if (n >= 10000) return Math.round(n).toLocaleString();
        if (n >= 100) return n.toFixed(1);
        if (n >= 10) return n.toFixed(1);
        return n.toFixed(2).replace(/\.00$/, '');
    };

    // --- Handlers ---
    const handleReload = () => window.location.reload();
    const handleReset = () => {
        setDays('0');
        setYears('');
        setMonths('');
        setUnitCO2('kg');
        setUnitForest('m2');
        setUnitGrain('kg');
        setUnitWater('l');
    };

    // --- Renderers ---
    const renderTimeInput = () => {
        // Custom Composite Rendering using standard css classes manually where needed
        if (timeUnit === 'yrs / mos' || timeUnit === 'yrs / mos / days') {
            return (
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                        <div className="std-label-row" style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '2px' }}>Years</div>
                        <div className="std-input-group">
                            <input type="number" className="std-input-invisible" value={years} onChange={e => setYears(e.target.value)} placeholder="0" onWheel={e => e.target.blur()} />
                        </div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <div className="std-label-row" style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '2px' }}>Months</div>
                        <div className="std-input-group">
                            <input type="number" className="std-input-invisible" value={months} onChange={e => setMonths(e.target.value)} placeholder="0" onWheel={e => e.target.blur()} />
                        </div>
                    </div>
                    {timeUnit === 'yrs / mos / days' && (
                        <div style={{ flex: 1 }}>
                            <div className="std-label-row" style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '2px' }}>Days</div>
                            <div className="std-input-group">
                                <input type="number" className="std-input-invisible" value={days} onChange={e => setDays(e.target.value)} placeholder="0" onWheel={e => e.target.blur()} />
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        // Standard Single Input using the Component
        // We need to inject the Unit Selector inside it. 
        // Our InputGroup component supports `isUnitDropdown` and `unitOptions`.
        return (
            <InputGroup
                value={days}
                onChange={setDays}
                unit={timeUnit}
                onUnitChange={setTimeUnit}
                isUnitDropdown={true}
                unitOptions={['days', 'wks', 'mos', 'yrs', 'yrs / mos', 'yrs / mos / days']}
                // We don't verify label here because the design has the label ABOVE this block in the main flow
                // But the component expects a label prop or renders nothing?
                // Let's pass empty label or modify component. Component renders label row if label exists? 
                // Currently InputGroup ALWAYS renders label row. 
                // We should pass "Time you've been vegan" as the label to the component.
                label="Time you've been vegan"
            />
        );
    };

    const creators = [{ name: "Rangsimatiti Binda Saichompoo", role: "Creator" }];
    const reviewers = [{ name: "Mariamy Chrdileli", role: "" }, { name: "Adena Benn", role: "" }];

    return (
        <CalculatorLayout
            title="Vegan Footprint Calculator"
            creators={creators}
            reviewers={reviewers}
            category="Ecology"
            tocItems={[
                "How is vegan footprint calculated?",
                "Being a vegan: The pros and cons of a plant-based diet",
                "Vegan diet, the environment and climate change",
                "How to go vegan?",
                "What if I don't want to go vegan?",
                "FAQs"
            ]}
            articleContent={
                <div className="calculator-article-content" style={{ padding: '0 16px', maxWidth: '800px', margin: '0 auto' }}>
                    <p>
                        The vegan footprint calculator estimates the number of animals and the amount of water, grain, CO2, and forests being vegan saves. If you want to know more about plant-based diet and lifestyle, our article below will discuss:
                    </p>
                    <ul>
                        <li>How vegan footprint is calculated;</li>
                        <li>Being a vegan: The pros and cons of a plant-based diet;</li>
                        <li>Vegan diet, the environment, and climate change;</li>
                        <li>How to go vegan; and more.</li>
                    </ul>

                    <h2 id="how-is-vegan-footprint-calculated">How is vegan footprint calculated?</h2>
                    <p>The calculator relies on the premise that, by being vegan for a day, you can save:</p>
                    <ul>
                        <li>1 animal life;</li>
                        <li>1,100 gallons of water;</li>
                        <li>40 pounds of grain;</li>
                        <li>30 square feet of forest; and</li>
                        <li>20 pounds of CO2.</li>
                    </ul>
                    <p>Once you enter the time you've been vegan, the calculator will estimate the resources and animal lives you've saved. You can change the units of the time and the results to answer questions like "How many animals does a vegan save per year?".</p>

                    <h3>Being a vegan can save water, grain, forests land and lower CO2 emissions.</h3>
                    <p>Let's say you decided to become a vegan last week. The calculations of animal lives, water, grains, forest lands, and CO2 emissions saved by your lifestyle change would be:</p>

                    <p><strong>Animal lives saved</strong> = number of days × 1<br />
                        Animal lives saved = 7</p>

                    <p><strong>Water saved</strong> = number of days × 1,100 gallons<br />
                        Water saved = 7 × 1,100 = 7,700 gallons</p>

                    <p><strong>Grains saved</strong> = number of days × 40 pounds<br />
                        Grains saved = 7 × 40 = 280 pounds</p>

                    <p><strong>Forest land saved</strong> = number of days × 30 ft²<br />
                        Forest land saved = 7 × 30 = 210 ft²</p>

                    <p><strong>CO2 emission saved</strong> = number of days × 20 pounds<br />
                        CO2 emission saved = 7 × 20 = 140 pounds</p>

                    <p>If you want to quickly calculate the benefits of going vegan, all you have to do is input the amount of time since you started your vegan journey. That's it! Omni's vegan footprint calculator will automatically calculate everything for you.</p>

                    <h2 id="being-a-vegan-pros-and-cons">Being a vegan: The pros and cons of a plant-based diet</h2>
                    <p>Vegan is a term used to refer to individuals who don't consume any meat or animal by-products. These include eggs, milk, honey, wool, and any other products that are derived or produced by animals.</p>

                    <h3>Benefits:</h3>
                    <ul>
                        <li><strong>Saving animal lives 🐓🐄🐖🐑</strong> — Of course, not eating meat alone can already spare millions of animals from being slaughtered. However, animal agriculture can also be very cruel to animals. Luckily, there is now a lot of awareness, and animal rights policies are being developed along the way;</li>
                        <li><strong>Environmentally friendly 🌏</strong> — Being vegan can help the environment. Since the production of meat and animal products can release a lot of CO2 emissions, less production of meat can be helpful to reduce their environmental impact. But...how exactly? If this matter is of interest to you, you can find more information in the section dedicated to vegan diet, the environment, and climate change or explore our meat footprint calculator;</li>
                        <li><strong>Healthy lifestyle 💪</strong> — A vegan person can be as healthy as someone who follows an animal-based diet, if not healthier! Research has suggested that even though meat contains many nutrients that our body needs, those same nutrients can also be found in plant-based foods. Moreover, there is evidence that consuming high amounts of meat, specifically red and processed meats, can increase the risk of heart disease, cancer and diabetes.</li>
                    </ul>

                    <h3>Downsides:</h3>
                    <ul>
                        <li><strong>Threat to the livestock production industry 👨🌾</strong> — There are a lot of farmers, workers, business owners, and a whole community in the economy that are financially dependent on meat production, which is derived from the livestock production industry;</li>
                        <li><strong>Importation of non-local products 🚚</strong> — If the demand increases, there will be more transportation from one country to another, leading to more greenhouse gas emissions. Anyhow, more research is needed to compare the impact of this to the effects of meat production itself;</li>
                        <li><strong>Not as easy as it sounds 🍔</strong> — It can be hard to say goodbye to our favorite meaty cheeseburger or other meat-based menus. In addition to this, it may be difficult not only to find specific vegan recipes but also ingredients that give the same taste and joy as our favorite animal-based products.</li>
                    </ul>

                    <h2 id="vegan-diet-environment-climate-change">Vegan diet, the environment and climate change</h2>
                    <p>Hold on a minute. What does being vegan have to do with climate change? Does this mean that eating less meat helps the environment? This is still an ongoing debate; anyhow, we can have a look at some possible reasons why consuming meat and animal products could be a contribution to climate change:</p>

                    <h3>Emissions and land use associated with animal products and substitutes.</h3>
                    <ul>
                        <li><strong>Greenhouse gas emissions</strong> — This is not because eating meat makes us release more CO2 😉, but because meat production requires so much energy, resources, and processes. Up to 14.5% of the overall human-generated greenhouse gas emissions come from this feedstock supply chain. Moreover, cattle are known for their natural methane generation capacity💨;</li>
                        <li><strong>Land use and agriculture</strong> — Animal products require a huge amount of space for barns, factories, and agricultural lands, specifically for crop plantations and, in some cases, grazing systems. It is estimated that if everyone became vegan, we could have reduced up to 75% of the land used for animal agriculture. Of course, we would still need plantations and agriculture for other purposes in the supply chain;</li>
                        <li><strong>Effects on biodiversity</strong> — As a result of increasing agricultural land use, a lot of natural habitats are destroyed. Deforestation is the first step to creating agrarian land for crops and feedstocks. This causes a lot of wild animals to lose their habitats and possibly end up dying out or migrating. The biodiversity can be changed;</li>
                        <li><strong>Overfishing, bycatch and ghost nets</strong> — Let's not forget about our aquatic friends🐟! The fishing industry is another highly impactful human act on the environment. A lot of fish populations are affected by our seafood consumption, including those we don't even eat!</li>
                    </ul>
                    <p>On the bright side, efforts such as aquaculture and the restrictions of harmful fishing gear are made to be less destructive to the ocean's ecosystem.</p>
                    <p>🙋 Did you know that despite being the cause of global warming, greenhouse gases (GHG) allow sunlight to reach Earth and keep it from completely freezing!🥶️ Look up the CO2 breathing emission calculator to find out how much CO2 you can generate.</p>

                    <h2 id="how-to-go-vegan">How to go vegan?</h2>
                    <p>If you've been swayed by the amount of resources being a vegan saves, here are some tips on how to go vegan:</p>
                    <ul>
                        <li><strong>Learn from well-researched and reliable sources 💻.</strong> You can find different types of vegan food, recipes, and even a vast amount of information on how specific ingredients are produced and end up on your delicious plate. Not only will you find more helpful knowledge on being vegan, but you will also learn about many procedures in the industries that are not widely mentioned in the media;</li>
                        <li><strong>Focus on adding new food rather than cutting out what you eat 🥙.</strong> Learn new recipes for vegan meals and add them to your diet until they replace meat entirely. You can start with vegetarianism. Find dishes you genuinely like so you don't feel like you sacrificed a lot. Luckily, there are plenty of blogs with recipes for plant-based meals;</li>
                        <li><strong>Try out vegan alternatives for products you eat now 🥛.</strong> For example, if you drink cow's milk, try substituting it with oat, soy, or almond milk. As new protein sources, you can replace meat with tofu, tempeh, beans, or nutritional yeast in your favorite recipe. Choose something that also tastes good for you;</li>
                        <li><strong>Find local sources of high-quality fruit and vegetables 🌽.</strong> If they're supposed to be the basis of your diet, they need to be good. It'll be best if you can find locally grown, seasonal plants. Although, frozen veggies are not bad either;</li>
                        <li><strong>Find vegan restaurants 🍻, try them out, and get inspired.</strong> If you cannot find many vegan restaurants near you, try ordering vegetarian menus or ask the restaurant to replace meat with vegan ingredients! Be creative and have fun;</li>
                        <li><strong>Don't forget vitamins and macros 🥗.</strong> It would be best to meet your dietary needs to sustain your veganism. Eat diverse and nutritious foods. If you want to create a week-by-week plan for macronutrient intake, visit our macro calculator;</li>
                        <li><strong>Consider vegan powder meal replacements or plant-based protein powder 💪.</strong> They're a great option when you don't have much time for cooking. It would be best to have most of your meals based on fresh products, however. For this, you might find this cooking measurement calculator useful;</li>
                        <li><strong>It's not just about food! 🐁</strong> Avoiding animal-based products is not limited to "meals". There are "cruelty-free" products that are considered vegan, animal-friendly, and environmentally friendly as well, e.g., cosmetics products with cruelty-free or vegan logos.</li>
                    </ul>

                    <h2 id="what-if-i-dont-want-to-go-vegan">What if I don't want to go vegan?</h2>
                    <p>That's completely okay! Your choice of food, beverages, and everyday lifestyles are all in your hands. There are many things to consider regarding your nutrition and choice of specific products. If being a vegan sounds too complicated for you, but you'd like to start consuming less meat, here are some possibilities you can consider:</p>
                    <ul>
                        <li><strong>Keep eating (less) meat 🍝</strong> — Reducing meat consumption itself is already a good start. You don't have to cut out your favorite Barbecue chicken wings completely, but you can limit it to 2 times a week instead of 4;</li>
                        <li><strong>Be a vegetarian 🥗</strong> — If completely cutting out animal-derived products (eggs, milk, etc.) is too extreme for you, try starting with being vegetarian! You can slowly decrease your meat consumption;</li>
                        <li><strong>Be a pescatarian 🍤</strong> — One of the many popular diets is only to eat fish and seafood. It can be another good start to decrease the consumption of other types of meat, especially red meat, poultry, and pork;</li>
                        <li><strong>Maintain your meat diet 🥩</strong> — If none of the above sounds attractive to you, it is alright to keep eating meat. It is also important to remember to support the choices made by your friends and family.</li>
                    </ul>

                    <h2 id="faqs">FAQs</h2>
                    <h3>How many animals will I save after 2 years of being vegan?</h3>
                    <p>You will save around 730 animal lives after two years of being a vegan. You will also save up to 14,610 lb of CO2, 21,915 square feet of forest land, 29,220 lb of grains, and 803,550 gallons of water!</p>

                    <h3>How do I calculate my vegan footprint?</h3>
                    <p>Assuming that per day, being vegan can save one animal life, 1,100 gallons of water, 40 lb of grain, 30 square feet of forest, and 20 lb of CO2, you can calculate your vegan footprint by using the following steps:</p>
                    <ol>
                        <li>Find out the number of days since you have been vegan. Let's say one year, so 365 days.</li>
                        <li>Multiply by the number of days to arrive at the number of animal lives and resources saved. For example:
                            <ul>
                                <li>Animal lives = 365 × 1 = 365 animals; and</li>
                                <li>CO2 emission = 365 × 20 = 7,300 gallons.</li>
                            </ul>
                        </li>
                    </ol>
                    <p>Congratulations! You have saved many lives and resources.</p>

                    <h3>Do vegans eat eggs?</h3>
                    <p>No, vegans do not eat eggs (some vegetarians do). Eggs are animal products, and these are absent from a vegan diet. Vegans may replace eggs with other protein-rich products such as tofu or lentils. Some good alternatives for baking are aquafaba, flax seeds, bananas, tapioca starch, and chickpea flour.</p>

                    <h3>Do vegans eat fish?</h3>
                    <p>No, vegans do not eat fish. They abstain from eating animal products, and fishes are animals. As a replacement, herbivores can use tofu or seitan and get a fishy flavor by adding algae and mushrooms. There are plenty of recipes for fish substitutes, such as vegan fish fingers, vegan fish fillets, or veggie tuna salad.</p>

                    <h3>What can vegans eat?</h3>
                    <p>Vegans can eat anything that is not an animal product. They rely on a plant-based diet, which includes grains, vegetables, nuts, fruit, seeds, legumes, oils, and plant "milk". Many traditional meat dishes now have vegan alternatives so that vegans can opt for meals like soy sausages, burgers with seitan, chili sin carne, etc.</p>

                    <h3>How do vegans get protein?</h3>
                    <p>Vegans get protein from plant-based foods such as:</p>
                    <ul>
                        <li>Tofu, tempeh, seitan;</li>
                        <li>Nuts and seeds;</li>
                        <li>Lentils, chickpeas, various beans;</li>
                        <li>Soy milk;</li>
                        <li>Rice, oats, quinoa, buckwheat; and</li>
                        <li>Hummus.</li>
                    </ul>

                    <h3>What vitamins should vegans take?</h3>
                    <p>Because a poor vegan diet may cause deficiencies, vegans may want to consider supplementing:</p>
                    <ul>
                        <li>Vitamin B12 (which occurs almost only in animal products);</li>
                        <li>Vitamin D (especially if you don't spend enough time in the sun); and</li>
                        <li>Omega-3 fatty acids: EPA and DHA (eicosapentaenoic and docosahexaenoic acids).</li>
                    </ul>
                    <p>Vegans should also monitor their iron, iodine, calcium, and zinc levels.</p>
                </div>
            }
        >
            <div className="std-calculator">

                {/* MAIN CARD */}
                <div className="std-section-card">

                    {/* Time Input Section */}
                    {/* If Composite, we render custom block + separate selector. If single, we use InputGroup. */}
                    {(timeUnit === 'yrs / mos' || timeUnit === 'yrs / mos / days') ? (
                        <div style={{ marginBottom: '24px' }}>
                            <div className="std-label-row">
                                Time you've been vegan
                                <MoreHorizontal size={16} className="std-more-dots" />
                            </div>
                            {renderTimeInput()}

                            {/* Separate Unit Selector for Composite Mode to allow switching back */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                                <div className="std-relative-container">
                                    <div
                                        className="std-unit-trigger"
                                        style={{ border: '1px solid #e5e7eb', borderRadius: '6px', height: '32px' }}
                                        onClick={() => setIsTimeUnitOpen(!isTimeUnitOpen)}
                                    >
                                        {timeUnit} <ChevronDown size={14} />
                                    </div>
                                    {isTimeUnitOpen && (
                                        <div className="std-dropdown-menu">
                                            {['days', 'wks', 'mos', 'yrs', 'yrs / mos', 'yrs / mos / days'].map(u => (
                                                <div key={u} className="std-dropdown-item" onClick={() => { setTimeUnit(u); setIsTimeUnitOpen(false); }}>
                                                    {u}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Single Mode: Use Standard Component
                        renderTimeInput()
                    )}

                    <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111827', margin: '32px 0 16px 0' }}>You've saved...</h4>

                    <ResultRow
                        label="Animal lives"
                        value={format(resAnimal)}
                    // No unit dropdown for animals
                    />

                    <ResultRow
                        label="CO₂"
                        value={format(resCO2)}
                        unit={unitCO2}
                        onUnitChange={setUnitCO2}
                        isUnitDropdown={true}
                        unitOptions={massUnits}
                    />

                    <ResultRow
                        label="Forests"
                        value={format(resForest)}
                        unit={unitForest}
                        onUnitChange={setUnitForest}
                        isUnitDropdown={true}
                        unitOptions={areaUnits}
                    />

                    <ResultRow
                        label="Grain"
                        value={format(resGrain)}
                        unit={unitGrain}
                        onUnitChange={setUnitGrain}
                        isUnitDropdown={true}
                        unitOptions={massUnits}
                    />

                    <ResultRow
                        label="Water"
                        value={format(resWater)}
                        unit={unitWater}
                        onUnitChange={setUnitWater}
                        isUnitDropdown={true}
                        unitOptions={volUnits}
                    />

                    <ActionPanel
                        onReload={handleReload}
                        onReset={handleReset}
                    />

                    <FeedbackRow />

                </div>
            </div>
        </CalculatorLayout>
    );
};

export default VeganFootprintCalculatorPage;
