import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import Home from './pages/Home';
import CategoryLayout from './components/CategoryLayout';
import { categoryPagesData } from './data/categoryPagesData';
import AboutUsPage from './pages/AboutUsPage';
import AtomCalculatorPage from './pages/Chemistry/AtomCalculatorPage';
import ElectronConfigCalculatorPage from './pages/Chemistry/ElectronConfigCalculatorPage';
import AtomicMassCalculatorPage from './pages/Chemistry/AtomicMassCalculatorPage';
import ElectronegativityCalculatorPage from './pages/Chemistry/ElectronegativityCalculatorPage';
import AverageAtomicMassCalculatorPage from './pages/Chemistry/AverageAtomicMassCalculatorPage';
import MolarMassCalculatorPage from './pages/Chemistry/MolarMassCalculatorPage';
import AcreageCalculatorPage from './pages/Conversion/AcreageCalculatorPage';
import HeightInInchesCalculatorPage from './pages/Conversion/HeightInInchesCalculatorPage';
import AreaConverterPage from './pages/Conversion/AreaConverterPage';
import InchesToFractionCalculatorPage from './pages/Conversion/InchesToFractionCalculatorPage';
import AresToHectaresConverterPage from './pages/Conversion/AresToHectaresConverterPage';
import LengthConverterPage from './pages/Conversion/LengthConverterPage';
import ZeroToSixtyCalculatorPage from './pages/EverydayLife/ZeroToSixtyCalculatorPage';
import MilesPerYearCalculatorPage from './pages/EverydayLife/MilesPerYearCalculatorPage';
import BoatSpeedCalculatorPage from './pages/EverydayLife/BoatSpeedCalculatorPage';
import BoostHorsepowerCalculatorPage from './pages/EverydayLife/BoostHorsepowerCalculatorPage';
import MpgCalculatorPage from './pages/EverydayLife/MpgCalculatorPage';
import MilesToDollarsCalculatorPage from './pages/EverydayLife/MilesToDollarsCalculatorPage';
import AnnealingCalculatorPage from './pages/Biology/AnnealingCalculatorPage';
import SalesTaxCalculatorPage from './pages/Finance/SalesTaxCalculatorPage';
import SalaryToHourlyCalculatorPage from './pages/Finance/SalaryToHourlyCalculatorPage';
import PValueCalculatorPage from './pages/Statistics/PValueCalculatorPage';
import ConfidenceIntervalCalculatorPage from './pages/Statistics/ConfidenceIntervalCalculatorPage';
import TestGradeCalculatorPage from './pages/Other/TestGradeCalculatorPage';
import TimeUntilCalculatorPage from './pages/EverydayLife/TimeUntilCalculatorPage';
import LogCalculatorPage from './pages/Math/LogCalculatorPage';
import SigFigCalculatorPage from './pages/Math/SigFigCalculatorPage';
import ScientificNotationCalculatorPage from './pages/Math/ScientificNotationCalculatorPage';
import SquareFootageCalculatorPage from './pages/Construction/SquareFootageCalculatorPage';
import PercentageIncreaseCalculatorPage from './pages/Math/PercentageIncreaseCalculatorPage';
import FractionToPercentCalculatorPage from './pages/Math/FractionToPercentCalculatorPage';
import PercentageOfPercentageCalculatorPage from './pages/Math/PercentageOfPercentageCalculatorPage';
import DecimalToPercentConverterPage from './pages/Math/DecimalToPercentConverterPage';
import PercentagePointCalculatorPage from './pages/Math/PercentagePointCalculatorPage';
import BattingAverageCalculatorPage from './pages/Sports/BattingAverageCalculatorPage';
import OnBasePercentageCalculatorPage from './pages/Sports/OnBasePercentageCalculatorPage';
import ERACalculatorPage from './pages/Sports/ERACalculatorPage';
import SluggingPercentageCalculatorPage from './pages/Sports/SluggingPercentageCalculatorPage';
import FieldingPercentageCalculatorPage from './pages/Sports/FieldingPercentageCalculatorPage';
import WARCalculatorPage from './pages/Sports/WARCalculatorPage';
import ACTScoreCalculatorPage from './pages/Other/ACTScoreCalculatorPage';
import GWACalculatorPage from './pages/Other/GWACalculatorPage';
import SemesterGradeCalculatorPage from './pages/Other/SemesterGradeCalculatorPage';
import HighSchoolGPACalculatorPage from './pages/Other/HighSchoolGPACalculatorPage';
import IELTSScoreCalculatorPage from './pages/Other/IELTSScoreCalculatorPage';
import PTEScoreCalculatorPage from './pages/Other/PTEScoreCalculatorPage';
import ButterCalculatorPage from './pages/Food/ButterCalculatorPage';
import GramsToTablespoonsPage from './pages/Food/GramsToTablespoonsPage';
import CakePanConverterPage from './pages/Food/CakePanConverterPage';
import GramsToTeaspoonsPage from './pages/Food/GramsToTeaspoonsPage';
import CookingMeasurementConverterPage from './pages/Food/CookingMeasurementConverterPage';
import MlToGramsCalculatorPage from './pages/Food/MlToGramsCalculatorPage';
import AveragePercentageCalculatorPage from './pages/Math/AveragePercentageCalculatorPage';
import AddictionCalculatorPage from './pages/DiscoverOmni/AddictionCalculatorPage';
import VampireApocalypseCalculatorPage from './pages/DiscoverOmni/VampireApocalypseCalculatorPage';
import AlienCivilizationCalculatorPage from './pages/DiscoverOmni/AlienCivilizationCalculatorPage';
import BlackFridayCalculatorPage from './pages/DiscoverOmni/BlackFridayCalculatorPage';
import IdealEggBoilingCalculatorPage from './pages/DiscoverOmni/IdealEggBoilingCalculatorPage';
import KoreanAgeCalculatorPage from './pages/DiscoverOmni/KoreanAgeCalculatorPage';
import MeatFootprintCalculatorPage from './pages/Ecology/MeatFootprintCalculatorPage';
import ImpliedProbabilityCalculatorPage from './pages/Statistics/ImpliedProbabilityCalculatorPage';
import AccuracyCalculatorPage from './pages/Statistics/AccuracyCalculatorPage';

import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
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
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/biology/annealing-temperature-calculator" element={<AnnealingCalculatorPage />} />
          <Route path="/chemistry/atom-calculator" element={<AtomCalculatorPage />} />
          <Route path="/chemistry/electron-configuration-calculator" element={<ElectronConfigCalculatorPage />} />
          <Route path="/chemistry/atomic-mass-calculator" element={<AtomicMassCalculatorPage />} />
          <Route path="/chemistry/electronegativity-calculator" element={<ElectronegativityCalculatorPage />} />
          <Route path="/chemistry/average-atomic-mass-calculator" element={<AverageAtomicMassCalculatorPage />} />
          <Route path="/chemistry/molar-mass-calculator" element={<MolarMassCalculatorPage />} />
          <Route path="/conversion/acreage-calculator" element={<AcreageCalculatorPage />} />
          <Route path="/conversion/height-in-inches-calculator" element={<HeightInInchesCalculatorPage />} />
          <Route path="/conversion/area-converter" element={<AreaConverterPage />} />
          <Route path="/conversion/inches-to-fraction-calculator" element={<InchesToFractionCalculatorPage />} />
          <Route path="/conversion/ares-to-hectares-converter" element={<AresToHectaresConverterPage />} />
          <Route path="/conversion/length-converter" element={<LengthConverterPage />} />
          <Route path="/everyday-life/0-60-calculator" element={<ZeroToSixtyCalculatorPage />} />
          <Route path="/everyday-life/miles-per-year-calculator" element={<MilesPerYearCalculatorPage />} />
          <Route path="/everyday-life/boat-speed-calculator" element={<BoatSpeedCalculatorPage />} />
          <Route path="/everyday-life/boost-horsepower-calculator" element={<BoostHorsepowerCalculatorPage />} />
          <Route path="/everyday-life/mpg-calculator" element={<MpgCalculatorPage />} />
          <Route path="/sports/batting-average-calculator" element={<BattingAverageCalculatorPage />} />
          <Route path="/sports/on-base-percentage-calculator" element={<OnBasePercentageCalculatorPage />} />
          <Route path="/sports/era-calculator" element={<ERACalculatorPage />} />
          <Route path="/sports/slugging-percentage-calculator" element={<SluggingPercentageCalculatorPage />} />
          <Route path="/sports/fielding-percentage-calculator" element={<FieldingPercentageCalculatorPage />} />
          <Route path="/sports/war-calculator" element={<WARCalculatorPage />} />
          <Route path="/everyday-life/miles-to-dollars-calculator" element={<MilesToDollarsCalculatorPage />} />
          <Route path="/finance/sales-tax-calculator" element={<SalesTaxCalculatorPage />} />
          <Route path="/finance/salary-to-hourly-calculator" element={<SalaryToHourlyCalculatorPage />} />
          <Route path="/statistics/p-value-calculator" element={<PValueCalculatorPage />} />
          <Route path="/statistics/confidence-interval-calculator" element={<ConfidenceIntervalCalculatorPage />} />
          <Route path="/statistics/implied-probability-calculator" element={<ImpliedProbabilityCalculatorPage />} />
          <Route path="/statistics/accuracy-calculator" element={<AccuracyCalculatorPage />} />
          <Route path="/everyday-life/time-until-calculator" element={<TimeUntilCalculatorPage />} />
          <Route path="/other/test-grade-calculator" element={<TestGradeCalculatorPage />} />
          <Route path="/other/act-score-calculator" element={<ACTScoreCalculatorPage />} />
          <Route path="/other/gwa-calculator" element={<GWACalculatorPage />} />
          <Route path="/other/semester-grade-calculator" element={<SemesterGradeCalculatorPage />} />
          <Route path="/other/high-school-gpa-calculator" element={<HighSchoolGPACalculatorPage />} />
          <Route path="/other/ielts-score-calculator" element={<IELTSScoreCalculatorPage />} />
          <Route path="/other/pte-score-calculator" element={<PTEScoreCalculatorPage />} />
          <Route path="/math/log-calculator" element={<LogCalculatorPage />} />
          <Route path="/math/sig-fig-calculator" element={<SigFigCalculatorPage />} />
          <Route path="/math/scientific-notation-calculator" element={<ScientificNotationCalculatorPage />} />
          <Route path="/construction/square-footage-calculator" element={<SquareFootageCalculatorPage />} />
          <Route path="/math/percentage-increase-calculator" element={<PercentageIncreaseCalculatorPage />} />
          <Route path="/math/fraction-to-percent-calculator" element={<FractionToPercentCalculatorPage />} />
          <Route path="/math/percentage-of-percentage-calculator" element={<PercentageOfPercentageCalculatorPage />} />
          <Route path="/math/decimal-to-percent-converter" element={<DecimalToPercentConverterPage />} />
          <Route path="/math/percentage-point-calculator" element={<PercentagePointCalculatorPage />} />
          <Route path="/food/butter-calculator" element={<ButterCalculatorPage />} />
          <Route path="/food/grams-to-tablespoons-converter" element={<GramsToTablespoonsPage />} />
          <Route path="/food/cake-pan-converter" element={<CakePanConverterPage />} />
          <Route path="/food/grams-to-teaspoons-converter" element={<GramsToTeaspoonsPage />} />
          <Route path="/food/cooking-measurement-converter" element={<CookingMeasurementConverterPage />} />
          <Route path="/food/ml-to-grams-calculator" element={<MlToGramsCalculatorPage />} />
          <Route path="/math/average-percentage-calculator" element={<AveragePercentageCalculatorPage />} />
          <Route path="/discover-omni/addiction-calculator" element={<AddictionCalculatorPage />} />
          <Route path="/discover-omni/vampire-apocalypse-calculator" element={<VampireApocalypseCalculatorPage />} />
          <Route path="/discover-omni/alien-civilization-calculator" element={<AlienCivilizationCalculatorPage />} />
          <Route path="/discover-omni/black-friday-calculator" element={<BlackFridayCalculatorPage />} />
          <Route path="/discover-omni/ideal-egg-boiling-calculator" element={<IdealEggBoilingCalculatorPage />} />
          <Route path="/discover-omni/korean-age-calculator" element={<KoreanAgeCalculatorPage />} />
          <Route path="/ecology/meat-footprint-calculator" element={<MeatFootprintCalculatorPage />} />
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
