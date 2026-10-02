import { useEffect, useState } from "react";
import axios from "axios";

import WaterBodyMap from "./WaterBodyMap";
import CommunityReports from "./pages/CommunityReports";
import PollutionReport from "./PollutionReport";
import ReportDetails from "./pages/ReportDetails";
import WaterBodyDetails from "./pages/WaterBodyDetails";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";
import Login from "./pages/Login";
import Register from "./pages/Register";

import { useAuth } from "./AuthContext";

const API_URL = "http://localhost:5000/api";

function App() {
  const {
    user,
    logout,
    isAuthenticated
  } = useAuth();

  const [authPage, setAuthPage] =
    useState("login");

  const [currentPage, setCurrentPage] =
    useState("dashboard");

  const [selectedReport, setSelectedReport] =
    useState(null);

  const [selectedWaterBody, setSelectedWaterBody] =
    useState(null);

  const [dashboardData, setDashboardData] =
    useState({
      waterBodies: 0,
      totalReports: 0,
      verifiedReports: 0,
      highRiskReports: 0,
      pendingReports: 0
    });

  useEffect(() => {
    if (
      isAuthenticated &&
      currentPage === "dashboard"
    ) {
      fetchDashboardData();
    }
  }, [
    currentPage,
    isAuthenticated
  ]);

  const fetchDashboardData = async () => {
    try {
      const [
        waterBodyResponse,
        reportResponse
      ] = await Promise.all([
        axios.get(
          `${API_URL}/water-bodies`
        ),
        axios.get(
          `${API_URL}/pollution-reports`
        )
      ]);

      const waterBodies =
        waterBodyResponse.data.waterBodies ||
        [];

      const reports =
        reportResponse.data.reports || [];

      const verifiedReports =
        reports.filter(
          (report) =>
            report.status === "Verified"
        );

      const highRiskReports =
        reports.filter(
          (report) =>
            report.severity === "High" ||
            report.severity === "Critical"
        );

      const pendingReports =
        reports.filter(
          (report) =>
            report.status === "Pending"
        );

      setDashboardData({
        waterBodies:
          waterBodies.length,
        totalReports:
          reports.length,
        verifiedReports:
          verifiedReports.length,
        highRiskReports:
          highRiskReports.length,
        pendingReports:
          pendingReports.length
      });
    } catch (error) {
      console.error(
        "Dashboard data error:",
        error
      );
    }
  };

  const handleLoginSuccess = () => {
    setAuthPage("login");
    setCurrentPage("dashboard");
  };

  const handleRegisterSuccess = (
    page
  ) => {
    if (page === "login") {
      setAuthPage("login");
      return;
    }

    setAuthPage("login");
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    logout();

    setSelectedReport(null);
    setSelectedWaterBody(null);
    setCurrentPage("dashboard");
    setAuthPage("login");
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setCurrentPage("report-details");
  };

  const handleViewWaterBody = (
    waterBody
  ) => {
    setSelectedWaterBody(waterBody);
    setCurrentPage(
      "water-body-details"
    );
  };

  const handleBackToMap = () => {
    setSelectedWaterBody(null);
    setCurrentPage("map");
  };

  const handleBackToReports = () => {
    setSelectedReport(null);
    setCurrentPage("reports");
  };

  if (!isAuthenticated) {
    if (authPage === "register") {
      return (
        <Register
          onRegisterSuccess={
            handleRegisterSuccess
          }
        />
      );
    }

    return (
      <Login
        onLoginSuccess={
          handleLoginSuccess
        }
        onGoToRegister={() =>
          setAuthPage("register")
        }
      />
    );
  }

  const isAdmin =
    user?.role === "admin";

  const renderPage = () => {
    if (currentPage === "dashboard") {
      return (
        <Dashboard
          data={dashboardData}
          onNavigate={setCurrentPage}
        />
      );
    }

    if (currentPage === "map") {
      return (
        <WaterBodyMap
          onViewDetails={
            handleViewWaterBody
          }
        />
      );
    }

    if (
      currentPage ===
      "water-body-details"
    ) {
      return (
        <WaterBodyDetails
          waterBody={
            selectedWaterBody
          }
          onBack={handleBackToMap}
        />
      );
    }

    if (currentPage === "reports") {
      return (
        <CommunityReports
          onViewReport={
            handleViewReport
          }
        />
      );
    }

    if (
      currentPage ===
      "report-details"
    ) {
      return (
        <ReportDetails
          report={selectedReport}
          onBack={
            handleBackToReports
          }
        />
      );
    }

    if (currentPage === "report") {
      return (
        <PollutionReport
          onSuccess={() => {
            setCurrentPage(
              "reports"
            );
          }}
        />
      );
    }

    if (currentPage === "profile") {
      return <Profile />;
    }

    if (
      currentPage === "admin" &&
      isAdmin
    ) {
      return <AdminPanel />;
    }

    return (
      <Dashboard
        data={dashboardData}
        onNavigate={setCurrentPage}
      />
    );
  };

  return (
    <div style={styles.app}>
      <aside style={styles.sidebar}>
        <div style={styles.logoSection}>
          <div style={styles.logoIcon}>
            💧
          </div>

          <div>
            <div style={styles.logoTitle}>
              Freshwater
            </div>

            <div
              style={
                styles.logoSubtitle
              }
            >
              Health Monitoring
            </div>
          </div>
        </div>

        <nav style={styles.nav}>
          <button
            onClick={() =>
              setCurrentPage(
                "dashboard"
              )
            }
            style={{
              ...styles.navButton,
              ...(currentPage ===
                "dashboard"
                ? styles.activeNavButton
                : {})
            }}
          >
            🏠 Dashboard
          </button>

          <button
            onClick={() =>
              setCurrentPage("map")
            }
            style={{
              ...styles.navButton,
              ...(currentPage ===
                "map" ||
                currentPage ===
                "water-body-details"
                ? styles.activeNavButton
                : {})
            }}
          >
            🗺️ Water Body Map
          </button>

          <button
            onClick={() =>
              setCurrentPage(
                "reports"
              )
            }
            style={{
              ...styles.navButton,
              ...(currentPage ===
                "reports"
                ? styles.activeNavButton
                : {})
            }}
          >
            📋 Community Reports
          </button>

          <button
            onClick={() =>
              setCurrentPage(
                "report"
              )
            }
            style={{
              ...styles.navButton,
              ...(currentPage ===
                "report"
                ? styles.activeNavButton
                : {})
            }}
          >
            ⚠️ Report Pollution
          </button>

          <button
            onClick={() =>
              setCurrentPage(
                "profile"
              )
            }
            style={{
              ...styles.navButton,
              ...(currentPage ===
                "profile"
                ? styles.activeNavButton
                : {})
            }}
          >
            👤 My Profile
          </button>

          {isAdmin && (
            <button
              onClick={() =>
                setCurrentPage(
                  "admin"
                )
              }
              style={{
                ...styles.navButton,
                ...(currentPage ===
                  "admin"
                  ? styles.activeNavButton
                  : {})
              }}
            >
              🛠️ Admin Panel
            </button>
          )}
        </nav>

        <div
          style={
            styles.sidebarFooter
          }
        >
          <div
            style={
              styles.communityBox
            }
          >
            <div
              style={
                styles.communityIcon
              }
            >
              🌱
            </div>

            <div>
              <div
                style={
                  styles.communityTitle
                }
              >
                Community Monitoring
              </div>

              <div
                style={
                  styles.communityText
                }
              >
                Help protect
                freshwater
                resources.
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main style={styles.main}>
        <header style={styles.topbar}>
          <div>
            <div
              style={
                styles.breadcrumb
              }
            >
              Freshwater Health
              Monitoring
            </div>

            <div
              style={
                styles.pageName
              }
            >
              Community Platform
            </div>
          </div>

          <div
            style={
              styles.topbarRight
            }
          >
            <div
              style={
                styles.userInfo
              }
            >
              <div
                style={
                  styles.userName
                }
              >
                {user?.name ||
                  "Community User"}
              </div>

              <div
                style={
                  styles.userRole
                }
              >
                {user?.role ||
                  "citizen"}
              </div>
            </div>

            <button
              onClick={
                handleLogout
              }
              style={
                styles.logoutButton
              }
            >
              Logout
            </button>
          </div>
        </header>

        <div
          style={styles.content}
        >
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

function Dashboard({
  data,
  onNavigate
}) {
  return (
    <div>
      <div
        style={
          styles.headingSection
        }
      >
        <h1
          style={
            styles.dashboardTitle
          }
        >
          Community Dashboard
        </h1>

        <p
          style={
            styles.dashboardSubtitle
          }
        >
          Monitor freshwater health
          through community
          observations and pollution
          reports.
        </p>
      </div>

      <div
        style={
          styles.statsGrid
        }
      >
        <div
          style={
            styles.dashboardCard
          }
        >
          <div
            style={
              styles.cardIcon
            }
          >
            🌊
          </div>

          <div
            style={
              styles.cardNumber
            }
          >
            {data.waterBodies}
          </div>

          <div
            style={
              styles.cardLabel
            }
          >
            Water Bodies
          </div>
        </div>

        <div
          style={
            styles.dashboardCard
          }
        >
          <div
            style={
              styles.cardIcon
            }
          >
            📋
          </div>

          <div
            style={
              styles.cardNumber
            }
          >
            {data.totalReports}
          </div>

          <div
            style={
              styles.cardLabel
            }
          >
            Pollution Reports
          </div>
        </div>

        <div
          style={
            styles.dashboardCard
          }
        >
          <div
            style={
              styles.cardIcon
            }
          >
            ✅
          </div>

          <div
            style={
              styles.cardNumber
            }
          >
            {data.verifiedReports}
          </div>

          <div
            style={
              styles.cardLabel
            }
          >
            Verified Reports
          </div>
        </div>

        <div
          style={
            styles.dashboardCard
          }
        >
          <div
            style={
              styles.cardIcon
            }
          >
            🔴
          </div>

          <div
            style={
              styles.cardNumber
            }
          >
            {data.highRiskReports}
          </div>

          <div
            style={
              styles.cardLabel
            }
          >
            High Risk Reports
          </div>
        </div>
      </div>

      <div
        style={
          styles.quickSection
        }
      >
        <h2
          style={
            styles.sectionHeading
          }
        >
          Community Actions
        </h2>

        <div
          style={
            styles.actionGrid
          }
        >
          <button
            onClick={() =>
              onNavigate("map")
            }
            style={
              styles.actionCard
            }
          >
            <div
              style={
                styles.actionIcon
              }
            >
              🗺️
            </div>

            <div
              style={
                styles.actionTitle
              }
            >
              Explore Map
            </div>

            <div
              style={
                styles.actionText
              }
            >
              View monitored water
              bodies and
              pollution locations.
            </div>
          </button>

          <button
            onClick={() =>
              onNavigate(
                "report"
              )
            }
            style={
              styles.actionCard
            }
          >
            <div
              style={
                styles.actionIcon
              }
            >
              ⚠️
            </div>

            <div
              style={
                styles.actionTitle
              }
            >
              Report Pollution
            </div>

            <div
              style={
                styles.actionText
              }
            >
              Submit a new
              pollution
              observation with
              evidence.
            </div>
          </button>

          <button
            onClick={() =>
              onNavigate(
                "reports"
              )
            }
            style={
              styles.actionCard
            }
          >
            <div
              style={
                styles.actionIcon
              }
            >
              📋
            </div>

            <div
              style={
                styles.actionTitle
              }
            >
              Community Reports
            </div>

            <div
              style={
                styles.actionText
              }
            >
              Review pollution
              observations
              submitted by the
              community.
            </div>
          </button>
        </div>
      </div>

      <div
        style={
          styles.monitoringCard
        }
      >
        <div>
          <h2
            style={
              styles.monitoringTitle
            }
          >
            Community Monitoring
            Status
          </h2>

          <p
            style={
              styles.monitoringText
            }
          >
            The platform is
            currently tracking{" "}
            <strong>
              {data.waterBodies}
            </strong>{" "}
            water body
            {data.waterBodies !== 1
              ? "ies"
              : ""}{" "}
            and{" "}
            <strong>
              {data.totalReports}
            </strong>{" "}
            pollution report
            {data.totalReports !==
              1
              ? "s"
              : ""}.
          </p>
        </div>

        <div
          style={
            styles.pendingBox
          }
        >
          <div
            style={
              styles.pendingNumber
            }
          >
            {data.pendingReports}
          </div>

          <div
            style={
              styles.pendingLabel
            }
          >
            Pending Verification
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    display: "flex",
    backgroundColor: "#f4f8f9",
    fontFamily:
      "Arial, Helvetica, sans-serif"
  },

  sidebar: {
    width: "245px",
    minHeight: "100vh",
    backgroundColor: "#0f4c5c",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0
  },

  logoSection: {
    padding: "25px 20px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderBottom:
      "1px solid rgba(255,255,255,0.12)"
  },

  logoIcon: {
    fontSize: "32px"
  },

  logoTitle: {
    fontSize: "18px",
    fontWeight: "700"
  },

  logoSubtitle: {
    fontSize: "12px",
    opacity: 0.75,
    marginTop: "2px"
  },

  nav: {
    padding: "20px 12px",
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },

  navButton: {
    width: "100%",
    backgroundColor: "transparent",
    border: "none",
    color: "#d7eef2",
    padding: "12px 14px",
    borderRadius: "8px",
    textAlign: "left",
    fontSize: "14px",
    cursor: "pointer"
  },

  activeNavButton: {
    backgroundColor: "#087f5b",
    color: "#ffffff",
    fontWeight: "700"
  },

  sidebarFooter: {
    marginTop: "auto",
    padding: "15px"
  },

  communityBox: {
    backgroundColor:
      "rgba(255,255,255,0.08)",
    padding: "14px",
    borderRadius: "10px",
    display: "flex",
    gap: "10px",
    alignItems: "flex-start"
  },

  communityIcon: {
    fontSize: "22px"
  },

  communityTitle: {
    fontSize: "12px",
    fontWeight: "700"
  },

  communityText: {
    fontSize: "11px",
    opacity: 0.75,
    lineHeight: "1.4",
    marginTop: "4px"
  },

  main: {
    marginLeft: "245px",
    width: "calc(100% - 245px)",
    minHeight: "100vh"
  },

  topbar: {
    minHeight: "72px",
    backgroundColor: "#ffffff",
    borderBottom:
      "1px solid #e0e6e8",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 30px",
    gap: "20px"
  },

  breadcrumb: {
    color: "#78909c",
    fontSize: "12px"
  },

  pageName: {
    color: "#263238",
    fontSize: "15px",
    fontWeight: "700",
    marginTop: "3px"
  },

  topbarRight: {
    display: "flex",
    alignItems: "center",
    gap: "15px"
  },

  userInfo: {
    textAlign: "right"
  },

  userName: {
    color: "#263238",
    fontSize: "13px",
    fontWeight: "700"
  },

  userRole: {
    color: "#78909c",
    fontSize: "11px",
    marginTop: "2px",
    textTransform: "capitalize"
  },

  logoutButton: {
    backgroundColor: "#ffffff",
    color: "#c62828",
    border: "1px solid #ef9a9a",
    padding: "8px 13px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "700"
  },

  content: {
    padding: "30px",
    maxWidth: "1400px",
    margin: "0 auto"
  },

  headingSection: {
    marginBottom: "25px"
  },

  dashboardTitle: {
    margin: "0 0 8px 0",
    color: "#155e75",
    fontSize: "34px"
  },

  dashboardSubtitle: {
    margin: 0,
    color: "#546e7a",
    fontSize: "16px",
    lineHeight: "1.6"
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "18px"
  },

  dashboardCard: {
    backgroundColor: "#ffffff",
    padding: "22px",
    borderRadius: "14px",
    boxShadow:
      "0 4px 15px rgba(0, 0, 0, 0.06)"
  },

  cardIcon: {
    fontSize: "25px",
    marginBottom: "8px"
  },

  cardNumber: {
    fontSize: "30px",
    fontWeight: "700",
    color: "#087f5b"
  },

  cardLabel: {
    marginTop: "5px",
    color: "#607d8b",
    fontSize: "14px"
  },

  quickSection: {
    marginTop: "30px"
  },

  sectionHeading: {
    color: "#155e75",
    fontSize: "22px",
    marginBottom: "15px"
  },

  actionGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px"
  },

  actionCard: {
    backgroundColor: "#ffffff",
    border:
      "1px solid #e1e8ea",
    borderRadius: "12px",
    padding: "22px",
    textAlign: "left",
    cursor: "pointer"
  },

  actionIcon: {
    fontSize: "28px",
    marginBottom: "10px"
  },

  actionTitle: {
    color: "#263238",
    fontWeight: "700",
    fontSize: "16px"
  },

  actionText: {
    color: "#607d8b",
    fontSize: "13px",
    lineHeight: "1.5",
    marginTop: "6px"
  },

  monitoringCard: {
    marginTop: "25px",
    backgroundColor: "#e0f2f1",
    padding: "22px 25px",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px"
  },

  monitoringTitle: {
    margin: "0 0 7px 0",
    color: "#155e75",
    fontSize: "19px"
  },

  monitoringText: {
    margin: 0,
    color: "#546e7a",
    fontSize: "14px",
    lineHeight: "1.5"
  },

  pendingBox: {
    backgroundColor: "#ffffff",
    padding: "15px 20px",
    borderRadius: "10px",
    textAlign: "center",
    minWidth: "130px"
  },

  pendingNumber: {
    color: "#f57f17",
    fontSize: "25px",
    fontWeight: "700"
  },

  pendingLabel: {
    color: "#607d8b",
    fontSize: "11px",
    marginTop: "3px"
  }
};

export default App;