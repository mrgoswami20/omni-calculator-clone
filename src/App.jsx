import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import Home from './pages/Home';
import CategoryLayout from './components/CategoryLayout';
import { categoryPagesData } from './data/categoryPagesData';
import AboutUsPage from './pages/AboutUsPage';
import AtomCalculatorPage from './pages/AtomCalculatorPage';
import ElectronConfigCalculatorPage from './pages/ElectronConfigCalculatorPage';
import AtomicMassCalculatorPage from './pages/AtomicMassCalculatorPage';
import ElectronegativityCalculatorPage from './pages/ElectronegativityCalculatorPage';
import AverageAtomicMassCalculatorPage from './pages/AverageAtomicMassCalculatorPage';
import MolarMassCalculatorPage from './pages/MolarMassCalculatorPage';
import AcreageCalculatorPage from './pages/AcreageCalculatorPage';
import HeightInInchesCalculatorPage from './pages/HeightInInchesCalculatorPage';
import AreaConverterPage from './pages/AreaConverterPage';
import InchesToFractionCalculatorPage from './pages/InchesToFractionCalculatorPage';
import AresToHectaresConverterPage from './pages/AresToHectaresConverterPage';
import LengthConverterPage from './pages/LengthConverterPage';
import ZeroToSixtyCalculatorPage from './pages/ZeroToSixtyCalculatorPage';
import MilesPerYearCalculatorPage from './pages/MilesPerYearCalculatorPage';
import BoatSpeedCalculatorPage from './pages/BoatSpeedCalculatorPage';
import BoostHorsepowerCalculatorPage from './pages/BoostHorsepowerCalculatorPage';
import MpgCalculatorPage from './pages/MpgCalculatorPage';
import MilesToDollarsCalculatorPage from './pages/MilesToDollarsCalculatorPage';
import AnnealingCalculatorPage from './pages/AnnealingCalculatorPage';
import SalesTaxCalculatorPage from './pages/SalesTaxCalculatorPage';
import PValueCalculatorPage from './pages/PValueCalculatorPage';
import ConfidenceIntervalCalculatorPage from './pages/ConfidenceIntervalCalculatorPage';
import TestGradeCalculatorPage from './pages/TestGradeCalculatorPage';
import LogCalculatorPage from './pages/LogCalculatorPage';
import SigFigCalculatorPage from './pages/SigFigCalculatorPage';
import ScientificNotationCalculatorPage from './pages/ScientificNotationCalculatorPage';
import SquareFootageCalculatorPage from './pages/SquareFootageCalculatorPage';
import PercentageIncreaseCalculatorPage from './pages/PercentageIncreaseCalculatorPage';
import FractionToPercentCalculatorPage from './pages/FractionToPercentCalculatorPage';
import PercentageOfPercentageCalculatorPage from './pages/PercentageOfPercentageCalculatorPage';
import DecimalToPercentConverterPage from './pages/DecimalToPercentConverterPage';
import PercentagePointCalculatorPage from './pages/PercentagePointCalculatorPage';
import BattingAverageCalculatorPage from './pages/BattingAverageCalculatorPage';
import OnBasePercentageCalculatorPage from './pages/OnBasePercentageCalculatorPage';
import ERACalculatorPage from './pages/ERACalculatorPage';
import SluggingPercentageCalculatorPage from './pages/SluggingPercentageCalculatorPage';
import FieldingPercentageCalculatorPage from './pages/FieldingPercentageCalculatorPage';
import WARCalculatorPage from './pages/WARCalculatorPage';
import ACTScoreCalculatorPage from './pages/ACTScoreCalculatorPage';
import GWACalculatorPage from './pages/GWACalculatorPage';
import SemesterGradeCalculatorPage from './pages/SemesterGradeCalculatorPage';
import HighSchoolGPACalculatorPage from './pages/HighSchoolGPACalculatorPage';
import IELTSScoreCalculatorPage from './pages/IELTSScoreCalculatorPage';
import PTEScoreCalculatorPage from './pages/PTEScoreCalculatorPage';
import ButterCalculatorPage from './pages/ButterCalculatorPage';
import GramsToTablespoonsPage from './pages/GramsToTablespoonsPage';
import CakePanConverterPage from './pages/CakePanConverterPage';
import GramsToTeaspoonsPage from './pages/GramsToTeaspoonsPage';
import CookingMeasurementConverterPage from './pages/CookingMeasurementConverterPage';
import MlToGramsCalculatorPage from './pages/MlToGramsCalculatorPage';
import AveragePercentageCalculatorPage from './pages/AveragePercentageCalculatorPage';

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
          <Route path="/statistics/p-value-calculator" element={<PValueCalculatorPage />} />
          <Route path="/statistics/confidence-interval-calculator" element={<ConfidenceIntervalCalculatorPage />} />
          <Route path="/other/grade-calculator" element={<TestGradeCalculatorPage />} />
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
