import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import CategoryLayout from './components/CategoryLayout';
import { categoryPagesData } from './data/categoryPagesData';
import Home from './pages/Home';
import AboutUsPage from './pages/AboutUsPage';

// --- Chemistry ---
import AtomCalculatorPage from './pages/Chemistry/AtomCalculatorPage';
import ElectronConfigCalculatorPage from './pages/Chemistry/ElectronConfigCalculatorPage';
import AtomicMassCalculatorPage from './pages/Chemistry/AtomicMassCalculatorPage';
import ElectronegativityCalculatorPage from './pages/Chemistry/ElectronegativityCalculatorPage';
import AverageAtomicMassCalculatorPage from './pages/Chemistry/AverageAtomicMassCalculatorPage';
import MolarMassCalculatorPage from './pages/Chemistry/MolarMassCalculatorPage';

// --- Conversion ---
import AcreageCalculatorPage from './pages/Conversion/AcreageCalculatorPage';
import HeightInInchesCalculatorPage from './pages/Conversion/HeightInInchesCalculatorPage';
import AreaConverterPage from './pages/Conversion/AreaConverterPage';
import InchesToFractionCalculatorPage from './pages/Conversion/InchesToFractionCalculatorPage';
import AresToHectaresConverterPage from './pages/Conversion/AresToHectaresConverterPage';
import LengthConverterPage from './pages/Conversion/LengthConverterPage';

// --- Everyday Life ---
import ZeroToSixtyCalculatorPage from './pages/EverydayLife/ZeroToSixtyCalculatorPage';
import MilesPerYearCalculatorPage from './pages/EverydayLife/MilesPerYearCalculatorPage';
import BoatSpeedCalculatorPage from './pages/EverydayLife/BoatSpeedCalculatorPage';
import BoostHorsepowerCalculatorPage from './pages/EverydayLife/BoostHorsepowerCalculatorPage';
import MpgCalculatorPage from './pages/EverydayLife/MpgCalculatorPage';
import MilesToDollarsCalculatorPage from './pages/EverydayLife/MilesToDollarsCalculatorPage';
import TimeUntilCalculatorPage from './pages/EverydayLife/TimeUntilCalculatorPage';

// --- Biology ---
import AnnealingCalculatorPage from './pages/Biology/AnnealingCalculatorPage';
import CellDoublingTimeCalculatorPage from './pages/Biology/CellDoublingTimeCalculatorPage';
import GenerationTimeCalculatorPage from './pages/Biology/GenerationTimeCalculatorPage';
import LigationCalculatorPage from './pages/Biology/LigationCalculatorPage';
import CellDilutionCalculatorPage from './pages/Biology/CellDilutionCalculatorPage';
import LogReductionCalculatorPage from './pages/Biology/LogReductionCalculatorPage';

// --- Finance ---
import SalesTaxCalculatorPage from './pages/Finance/SalesTaxCalculatorPage';
import SalaryToHourlyCalculatorPage from './pages/Finance/SalaryToHourlyCalculatorPage';
import MarginCalculatorPage from './pages/Finance/MarginCalculatorPage';

// --- Math ---
import PercentageIncreaseCalculatorPage from './pages/Math/PercentageIncreaseCalculatorPage';
import LogCalculatorPage from './pages/Math/LogCalculatorPage';
import SigFigCalculatorPage from './pages/Math/SigFigCalculatorPage';
import ScientificNotationCalculatorPage from './pages/Math/ScientificNotationCalculatorPage';
import FractionToPercentCalculatorPage from './pages/Math/FractionToPercentCalculatorPage';
import PercentageOfPercentageCalculatorPage from './pages/Math/PercentageOfPercentageCalculatorPage';
import DecimalToPercentConverterPage from './pages/Math/DecimalToPercentConverterPage';
import PercentagePointCalculatorPage from './pages/Math/PercentagePointCalculatorPage';
import AveragePercentageCalculatorPage from './pages/Math/AveragePercentageCalculatorPage';

// --- Statistics ---
import PValueCalculatorPage from './pages/Statistics/PValueCalculatorPage';
import ConfidenceIntervalCalculatorPage from './pages/Statistics/ConfidenceIntervalCalculatorPage';
import ImpliedProbabilityCalculatorPage from './pages/Statistics/ImpliedProbabilityCalculatorPage';
import JointProbabilityCalculatorPage from './pages/Statistics/JointProbabilityCalculatorPage';
import AccuracyCalculatorPage from './pages/Statistics/AccuracyCalculatorPage';
import ANOVACalculatorPage from './pages/Statistics/ANOVACalculatorPage';
import BayesTheoremCalculatorPage from './pages/Statistics/BayesTheoremCalculatorPage';
import LotteryCalculatorPage from './pages/Statistics/LotteryCalculatorPage';

// --- Other / Education ---
import TestGradeCalculatorPage from './pages/Other/TestGradeCalculatorPage';
import ACTScoreCalculatorPage from './pages/Other/ACTScoreCalculatorPage';
import GWACalculatorPage from './pages/Other/GWACalculatorPage';
import SemesterGradeCalculatorPage from './pages/Other/SemesterGradeCalculatorPage';
import HighSchoolGPACalculatorPage from './pages/Other/HighSchoolGPACalculatorPage';
import IELTSScoreCalculatorPage from './pages/Other/IELTSScoreCalculatorPage';
import PTEScoreCalculatorPage from './pages/Other/PTEScoreCalculatorPage';

// --- Construction ---
import SquareFootageCalculatorPage from './pages/Construction/SquareFootageCalculatorPage';
import BoardFootCalculatorPage from './pages/Construction/BoardFootCalculatorPage';
import SqFtToCuYdsCalculatorPage from './pages/Construction/SqFtToCuYdsCalculatorPage';
import GallonsPerSquareFootCalculatorPage from './pages/Construction/GallonsPerSquareFootCalculatorPage';
import SquareYardsCalculatorPage from './pages/Construction/SquareYardsCalculatorPage';
import CubicYardCalculatorPage from './pages/Construction/CubicYardCalculatorPage';

// --- Sports ---
import BattingAverageCalculatorPage from './pages/Sports/BattingAverageCalculatorPage';
import OnBasePercentageCalculatorPage from './pages/Sports/OnBasePercentageCalculatorPage';
import ERACalculatorPage from './pages/Sports/ERACalculatorPage';
import SluggingPercentageCalculatorPage from './pages/Sports/SluggingPercentageCalculatorPage';
import FieldingPercentageCalculatorPage from './pages/Sports/FieldingPercentageCalculatorPage';
import WARCalculatorPage from './pages/Sports/WARCalculatorPage';

// --- Food ---
import ButterCalculatorPage from './pages/Food/ButterCalculatorPage';
import GramsToTablespoonsPage from './pages/Food/GramsToTablespoonsPage';
import CakePanConverterPage from './pages/Food/CakePanConverterPage';
import GramsToTeaspoonsPage from './pages/Food/GramsToTeaspoonsPage';
import CookingMeasurementConverterPage from './pages/Food/CookingMeasurementConverterPage';
import MlToGramsCalculatorPage from './pages/Food/MlToGramsCalculatorPage';

// --- Discover Omni ---
import AddictionCalculatorPage from './pages/DiscoverOmni/AddictionCalculatorPage';
import VampireApocalypseCalculatorPage from './pages/DiscoverOmni/VampireApocalypseCalculatorPage';
import AlienCivilizationCalculatorPage from './pages/DiscoverOmni/AlienCivilizationCalculatorPage';
import BlackFridayCalculatorPage from './pages/DiscoverOmni/BlackFridayCalculatorPage';
import IdealEggBoilingCalculatorPage from './pages/DiscoverOmni/IdealEggBoilingCalculatorPage';
import KoreanAgeCalculatorPage from './pages/DiscoverOmni/KoreanAgeCalculatorPage';

// --- Ecology ---
import MeatFootprintCalculatorPage from './pages/Ecology/MeatFootprintCalculatorPage';
import FlightCarbonFootprintCalculatorPage from './pages/Ecology/FlightCarbonFootprintCalculatorPage';
import BagFootprintCalculatorPage from './pages/Ecology/BagFootprintCalculatorPage';
import KayaIdentityCalculatorPage from './pages/Ecology/KayaIdentityCalculatorPage';
import DripFaucetCalculatorPage from './pages/Ecology/DripFaucetCalculatorPage';
import VeganFootprintCalculatorPage from './pages/Ecology/VeganFootprintCalculatorPage';

// --- Physics ---
import ArrowSpeedCalculatorPage from './pages/Physics/ArrowSpeedCalculatorPage';
import MomentumCalculatorPage from './pages/Physics/MomentumCalculatorPage';
import BallisticCoefficientCalculatorPage from './pages/Physics/BallisticCoefficientCalculatorPage';
import FrictionCalculatorPage from './pages/Physics/FrictionCalculatorPage';
import QuarterMileCalculatorPage from './pages/Physics/QuarterMileCalculatorPage';
import FreeFallCalculatorPage from './pages/Physics/FreeFallCalculatorPage';

// --- Health ---
import ABSICalculatorPage from './pages/Health/ABSICalculatorPage';
import AdjustedBodyWeightCalculatorPage from './pages/Health/AdjustedBodyWeightCalculatorPage';
import BAICalculatorPage from './pages/Health/BAICalculatorPage';
import FFMICalculatorPage from './pages/Health/FFMICalculatorPage';
import LeanBodyMassCalculatorPage from './pages/Health/LeanBodyMassCalculatorPage';
import KarvonenFormulaCalculatorPage from './pages/Health/KarvonenFormulaCalculatorPage';
import KitShowcasePage from './pages/KitShowcasePage';

import './index.css';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState('signup');

  const handleOpenAuth = (tab) => {
    setAuthTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleCloseAuth = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <Header onOpenAuth={handleOpenAuth} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUsPage />} />

          {/* Category Listing Routes */}
          <Route path="/biology" element={<CategoryLayout data={categoryPagesData.biology} />} />
          <Route path="/chemistry" element={<CategoryLayout data={categoryPagesData.chemistry} />} />
          <Route path="/construction" element={<CategoryLayout data={categoryPagesData.construction} />} />
          <Route path="/conversion" element={<CategoryLayout data={categoryPagesData.conversion} />} />
          <Route path="/ecology" element={<CategoryLayout data={categoryPagesData.ecology} />} />
          <Route path="/everyday-life" element={<CategoryLayout data={categoryPagesData.everyday_life} />} />
          <Route path="/finance" element={<CategoryLayout data={categoryPagesData.finance} />} />
          <Route path="/food" element={<CategoryLayout data={categoryPagesData.food} />} />
          <Route path="/health" element={<CategoryLayout data={categoryPagesData.health} />} />
          <Route path="/math" element={<CategoryLayout data={categoryPagesData.math} />} />
          <Route path="/physics" element={<CategoryLayout data={categoryPagesData.physics} />} />
          <Route path="/sports" element={<CategoryLayout data={categoryPagesData.sports} />} />
          <Route path="/statistics" element={<CategoryLayout data={categoryPagesData.statistics} />} />
          <Route path="/other" element={<CategoryLayout data={categoryPagesData.other} />} />
          <Route path="/discover-omni" element={<CategoryLayout data={categoryPagesData['discover-omni']} />} />

          {/* Individual Calculator Routes */}
          {/* Physics */}
          <Route path="/physics/arrow-speed-calculator" element={<ArrowSpeedCalculatorPage />} />
          <Route path="/physics/momentum-calculator" element={<MomentumCalculatorPage />} />
          <Route path="/physics/ballistic-coefficient-calculator" element={<BallisticCoefficientCalculatorPage />} />
          <Route path="/physics/friction-calculator" element={<FrictionCalculatorPage />} />
          <Route path="/physics/quarter-mile-calculator" element={<QuarterMileCalculatorPage />} />
          <Route path="/physics/free-fall-calculator" element={<FreeFallCalculatorPage />} />

          {/* Biology */}
          <Route path="/biology/annealing-temperature-calculator" element={<AnnealingCalculatorPage />} />
          <Route path="/biology/cell-doubling-time-calculator" element={<CellDoublingTimeCalculatorPage />} />
          <Route path="/biology/generation-time-calculator" element={<GenerationTimeCalculatorPage />} />
          <Route path="/biology/ligation-calculator" element={<LigationCalculatorPage />} />
          <Route path="/biology/cell-dilution-calculator" element={<CellDilutionCalculatorPage />} />
          <Route path="/biology/log-reduction-calculator" element={<LogReductionCalculatorPage />} />

          {/* Chemistry */}
          <Route path="/chemistry/atom-calculator" element={<AtomCalculatorPage />} />
          <Route path="/chemistry/electron-configuration-calculator" element={<ElectronConfigCalculatorPage />} />
          <Route path="/chemistry/atomic-mass-calculator" element={<AtomicMassCalculatorPage />} />
          <Route path="/chemistry/electronegativity-calculator" element={<ElectronegativityCalculatorPage />} />
          <Route path="/chemistry/average-atomic-mass-calculator" element={<AverageAtomicMassCalculatorPage />} />
          <Route path="/chemistry/molar-mass-calculator" element={<MolarMassCalculatorPage />} />

          {/* Conversion */}
          <Route path="/conversion/acreage-calculator" element={<AcreageCalculatorPage />} />
          <Route path="/conversion/height-in-inches-calculator" element={<HeightInInchesCalculatorPage />} />
          <Route path="/conversion/area-converter" element={<AreaConverterPage />} />
          <Route path="/conversion/inches-to-fraction-calculator" element={<InchesToFractionCalculatorPage />} />
          <Route path="/conversion/ares-to-hectares-converter" element={<AresToHectaresConverterPage />} />
          <Route path="/conversion/length-converter" element={<LengthConverterPage />} />

          {/* Everyday Life */}
          <Route path="/everyday-life/0-60-calculator" element={<ZeroToSixtyCalculatorPage />} />
          <Route path="/everyday-life/miles-per-year-calculator" element={<MilesPerYearCalculatorPage />} />
          <Route path="/everyday-life/boat-speed-calculator" element={<BoatSpeedCalculatorPage />} />
          <Route path="/everyday-life/boost-horsepower-calculator" element={<BoostHorsepowerCalculatorPage />} />
          <Route path="/everyday-life/mpg-calculator" element={<MpgCalculatorPage />} />
          <Route path="/everyday-life/miles-to-dollars-calculator" element={<MilesToDollarsCalculatorPage />} />
          <Route path="/everyday-life/time-until-calculator" element={<TimeUntilCalculatorPage />} />

          {/* Sports */}
          <Route path="/sports/batting-average-calculator" element={<BattingAverageCalculatorPage />} />
          <Route path="/sports/on-base-percentage-calculator" element={<OnBasePercentageCalculatorPage />} />
          <Route path="/sports/era-calculator" element={<ERACalculatorPage />} />
          <Route path="/sports/slugging-percentage-calculator" element={<SluggingPercentageCalculatorPage />} />
          <Route path="/sports/fielding-percentage-calculator" element={<FieldingPercentageCalculatorPage />} />
          <Route path="/sports/war-calculator" element={<WARCalculatorPage />} />

          {/* Finance */}
          <Route path="/finance/sales-tax-calculator" element={<SalesTaxCalculatorPage />} />
          <Route path="/finance/salary-to-hourly-calculator" element={<SalaryToHourlyCalculatorPage />} />
          <Route path="/finance/margin-calculator" element={<MarginCalculatorPage />} />

          {/* Math */}
          <Route path="/math/percentage-increase-calculator" element={<PercentageIncreaseCalculatorPage />} />
          <Route path="/math/log-calculator" element={<LogCalculatorPage />} />
          <Route path="/math/sig-fig-calculator" element={<SigFigCalculatorPage />} />
          <Route path="/math/scientific-notation-calculator" element={<ScientificNotationCalculatorPage />} />
          <Route path="/math/fraction-to-percent-calculator" element={<FractionToPercentCalculatorPage />} />
          <Route path="/math/percentage-of-percentage-calculator" element={<PercentageOfPercentageCalculatorPage />} />
          <Route path="/math/decimal-to-percent-converter" element={<DecimalToPercentConverterPage />} />
          <Route path="/math/percentage-point-calculator" element={<PercentagePointCalculatorPage />} />
          <Route path="/math/average-percentage-calculator" element={<AveragePercentageCalculatorPage />} />

          {/* Statistics */}
          <Route path="/statistics/p-value-calculator" element={<PValueCalculatorPage />} />
          <Route path="/statistics/confidence-interval-calculator" element={<ConfidenceIntervalCalculatorPage />} />
          <Route path="/statistics/implied-probability-calculator" element={<ImpliedProbabilityCalculatorPage />} />
          <Route path="/statistics/accuracy-calculator" element={<AccuracyCalculatorPage />} />
          <Route path="/statistics/anova-calculator" element={<ANOVACalculatorPage />} />
          <Route path="/statistics/joint-probability-calculator" element={<JointProbabilityCalculatorPage />} />
          <Route path="/statistics/bayes-theorem-calculator" element={<BayesTheoremCalculatorPage />} />
          <Route path="/statistics/lottery-calculator" element={<LotteryCalculatorPage />} />

          {/* Other / Education */}
          <Route path="/other/test-grade-calculator" element={<TestGradeCalculatorPage />} />
          <Route path="/other/act-score-calculator" element={<ACTScoreCalculatorPage />} />
          <Route path="/other/gwa-calculator" element={<GWACalculatorPage />} />
          <Route path="/other/semester-grade-calculator" element={<SemesterGradeCalculatorPage />} />
          <Route path="/other/high-school-gpa-calculator" element={<HighSchoolGPACalculatorPage />} />
          <Route path="/other/ielts-score-calculator" element={<IELTSScoreCalculatorPage />} />
          <Route path="/other/pte-score-calculator" element={<PTEScoreCalculatorPage />} />

          {/* Construction */}
          <Route path="/construction/square-footage-calculator" element={<SquareFootageCalculatorPage />} />
          <Route path="/construction/board-foot-calculator" element={<BoardFootCalculatorPage />} />
          <Route path="/construction/square-feet-to-cubic-yards-calculator" element={<SqFtToCuYdsCalculatorPage />} />
          <Route path="/construction/gallons-per-square-foot-calculator" element={<GallonsPerSquareFootCalculatorPage />} />
          <Route path="/construction/square-yards-calculator" element={<SquareYardsCalculatorPage />} />
          <Route path="/construction/cubic-yard-calculator" element={<CubicYardCalculatorPage />} />

          {/* Food */}
          <Route path="/food/butter-calculator" element={<ButterCalculatorPage />} />
          <Route path="/food/grams-to-tablespoons-converter" element={<GramsToTablespoonsPage />} />
          <Route path="/food/cake-pan-converter" element={<CakePanConverterPage />} />
          <Route path="/food/grams-to-teaspoons-converter" element={<GramsToTeaspoonsPage />} />
          <Route path="/food/cooking-measurement-converter" element={<CookingMeasurementConverterPage />} />
          <Route path="/food/ml-to-grams-calculator" element={<MlToGramsCalculatorPage />} />

          {/* Discover Omni */}
          <Route path="/discover-omni/addiction-calculator" element={<AddictionCalculatorPage />} />
          <Route path="/discover-omni/vampire-apocalypse-calculator" element={<VampireApocalypseCalculatorPage />} />
          <Route path="/discover-omni/alien-civilization-calculator" element={<AlienCivilizationCalculatorPage />} />
          <Route path="/discover-omni/black-friday-calculator" element={<BlackFridayCalculatorPage />} />
          <Route path="/discover-omni/ideal-egg-boiling-calculator" element={<IdealEggBoilingCalculatorPage />} />
          <Route path="/discover-omni/korean-age-calculator" element={<KoreanAgeCalculatorPage />} />

          {/* Ecology */}
          <Route path="/ecology/meat-footprint-calculator" element={<MeatFootprintCalculatorPage />} />
          <Route path="/ecology/flight-carbon-footprint-calculator" element={<FlightCarbonFootprintCalculatorPage />} />
          <Route path="/ecology/bag-footprint-calculator" element={<BagFootprintCalculatorPage />} />
          <Route path="/ecology/kaya-identity-calculator" element={<KayaIdentityCalculatorPage />} />
          <Route path="/ecology/drip-faucet-calculator" element={<DripFaucetCalculatorPage />} />
          <Route path="/ecology/vegan-footprint-calculator" element={<VeganFootprintCalculatorPage />} />

          {/* Health */}
          <Route path="/health/absi-calculator" element={<ABSICalculatorPage />} />
          <Route path="/health/adjusted-body-weight-calculator" element={<AdjustedBodyWeightCalculatorPage />} />
          <Route path="/health/bai-calculator" element={<BAICalculatorPage />} />
          <Route path="/health/ffmi-calculator" element={<FFMICalculatorPage />} />
          <Route path="/health/lean-body-mass-calculator" element={<LeanBodyMassCalculatorPage />} />
          <Route path="/health/lean-body-mass-calculator" element={<LeanBodyMassCalculatorPage />} />
          <Route path="/health/karvonen-formula-calculator" element={<KarvonenFormulaCalculatorPage />} />

          {/* Temporary Kit Showcase */}
          <Route path="/kit-showcase" element={<KitShowcasePage />} />
        </Routes>
        <Footer />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={handleCloseAuth}
          initialTab={authTab}
        />
      </div>
    </Router>
  );
}

export default App;
