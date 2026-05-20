import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Alert
} from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import BackButton from '../../components/BackButton';
const screenWidth = Dimensions.get('window').width;

// Mocked Data (Replace this with a fetch() call to your PHP API)
const apiData = {
  daily: {
    revenue: "4,250.00",
    topProduct: "Fresh Milk",
    topUnits: 45,
    avgTransaction: "120.50",
    labels: ["8AM", "12PM", "4PM", "8PM"],
    chartData: [500, 1200, 1800, 750],
  },
  weekly: {
    revenue: "32,840.00",
    topProduct: "Coca-Cola 1L",
    topUnits: 312,
    avgTransaction: "185.00",
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    chartData: [4200, 3800, 4500, 4100, 5200, 6100, 4940],
  },
  yearly: {
    revenue: "1,452,000.00",
    topProduct: "Teff Flour 5kg",
    topUnits: 1420,
    avgTransaction: "210.00",
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    chartData: [110000, 115000, 108000, 125000, 130000, 145000],
  }
};

export default function SalesAnalyticsScreen() {
  const [timeframe, setTimeframe] = useState('weekly');
  const currentData = apiData[timeframe];

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
    strokeWidth: 3,
    barPercentage: 0.6,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>

                <BackButton onPress={() => {}} />
            <Text style={styles.headerTitle}>Sales Analytics</Text>
          
        </View>
              <Text style={styles.headerSubtitle}>Supermarket Performance</Text>
        {/* Timeframe Toggle */}
        <View style={styles.toggleContainer}>
          {['daily', 'weekly', 'yearly'].map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[styles.toggleBtn, timeframe === mode && styles.toggleBtnActive]}
              onPress={() => setTimeframe(mode)}
            >
              <Text style={[styles.toggleText, timeframe === mode && styles.toggleTextActive]}>
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Main Revenue Card */}
        <View style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Total Revenue</Text>
            <FontAwesome5 name="hand-holding-usd" size={20} color="#2ecc71" />
          </View>
          <Text style={styles.revenueValue}>
            <Text style={styles.currency}>ETB </Text>
            {currentData.revenue}
          </Text>
          <View style={styles.trendBadge}>
            <Ionicons name="trending-up" size={14} color="#2ecc71" />
            <Text style={styles.trendText}> Live Performance</Text>
          </View>
        </View>

        {/* Secondary Metrics Row */}
        <View style={styles.metricsRow}>
          <View style={[styles.smallCard, { marginRight: 10 }]}>
            <FontAwesome5 name="crown" size={18} color="#f39c12" style={styles.cardIcon} />
            <Text style={styles.smallCardTitle}>Top Product</Text>
            <Text style={styles.smallCardValue} numberOfLines={1}>{currentData.topProduct}</Text>
            <Text style={styles.smallCardSub}>{currentData.topUnits} units sold</Text>
          </View>

          <View style={[styles.smallCard, { marginLeft: 10 }]}>
            <FontAwesome5 name="receipt" size={18} color="#3498db" style={styles.cardIcon} />
            <Text style={styles.smallCardTitle}>Avg. Transaction</Text>
            <Text style={styles.smallCardValue}>ETB {currentData.avgTransaction}</Text>
            <Text style={styles.smallCardSub}>Across all logs</Text>
          </View>
        </View>

        {/* Dynamic Chart Area */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>
            {timeframe === 'yearly' ? 'Growth Trend' : 'Sales Distribution'}
          </Text>
          {timeframe === 'yearly' ? (
            <LineChart
              data={{
                labels: currentData.labels,
                datasets: [{ data: currentData.chartData }]
              }}
              width={screenWidth - 40}
              height={220}
              chartConfig={{...chartConfig, color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`}}
              bezier
              style={styles.chartStyle}
            />
          ) : (
            <BarChart
              data={{
                labels: currentData.labels,
                datasets: [{ data: currentData.chartData }]
              }}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              style={styles.chartStyle}
              showValuesOnTopOfBars={false}
            />
          )}
        </View>

        {/* AI Recommendations (Horizontal Swipe) */}
        <View style={styles.aiSection}>
          <View style={styles.aiHeader}>
            <FontAwesome5 name="robot" size={20} color="#2c3e50" />
            <Text style={styles.aiTitle}>Smart Pilot Insights</Text>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.aiScrollContent}
          >
            {/* Card 1: Inventory */}
            <View style={styles.aiCard}>
              <View style={[styles.aiTag, { backgroundColor: '#ffebee' }]}>
                <Text style={[styles.aiTagText, { color: '#e74c3c' }]}>INVENTORY RISK</Text>
              </View>
              <Text style={styles.aiCardText}>
                <Text style={{fontWeight: 'bold'}}>Velocity Alert:</Text> 'Fresh Milk' is selling fast. Remaining stock will deplete in 2 days.
              </Text>
              <TouchableOpacity style={styles.aiBtnAction}>
                <Text style={styles.aiBtnText}>Order Supplier</Text>
              </TouchableOpacity>
            </View>

            {/* Card 2: Expiry */}
            <View style={styles.aiCard}>
              <View style={[styles.aiTag, { backgroundColor: '#fff3e0' }]}>
                <Text style={[styles.aiTagText, { color: '#f39c12' }]}>EXPIRY RISK</Text>
              </View>
              <Text style={styles.aiCardText}>
                <Text style={{fontWeight: 'bold'}}>Waste Prevention:</Text> A batch of 'Greek Yogurt' expires in 3 days.
              </Text>
              <TouchableOpacity style={[styles.aiBtnAction, { backgroundColor: '#3498db' }]}>
                <Text style={styles.aiBtnText}>Clearance Sale</Text>
              </TouchableOpacity>
            </View>

            {/* Card 3: Strategy */}
            <View style={styles.aiCard}>
              <View style={[styles.aiTag, { backgroundColor: '#e3f2fd' }]}>
                <Text style={[styles.aiTagText, { color: '#3498db' }]}>STRATEGIC MOVE</Text>
              </View>
              <Text style={styles.aiCardText}>
                <Text style={{fontWeight: 'bold'}}>Bundle Suggestion:</Text> Customers frequently buy 'Chips' & 'Soda'. Try a promo bundle.
              </Text>
              <TouchableOpacity style={[styles.aiBtnAction, { backgroundColor: '#2c3e50' }]}>
                <Text style={styles.aiBtnText}>View Inventory</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        <View style={{ height: 40 }} /> {/* Bottom padding */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f7f6',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 55,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20
  },
  headerTitle: {
    fontSize: 26,
    marginLeft: 20,
    fontWeight: '800',
    color: '#0056b3',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
    marginBottom: 10,
  },
  profileBtn: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#e0e6ed',
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleBtnActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontWeight: '600',
    color: '#7f8c8d',
  },
  toggleTextActive: {
    color: '#2c3e50',
  },
  mainCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0056b3',
  },
  revenueValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2c3e50',
    marginBottom: 10,
  },
  currency: {
    fontSize: 20,
    fontWeight: '600',
    color: '#95a5a6',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eafaf1',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2ecc71',
    marginLeft: 4,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  smallCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardIcon: {
    marginBottom: 12,
  },
  smallCardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0056b3',
    marginBottom: 6,
  },
  smallCardValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2c3e50',
    marginBottom: 4,
  },
  smallCardSub: {
    fontSize: 12,
    color: '#95a5a6',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0056b3',
    marginBottom: 15,
  },
  chartStyle: {
    borderRadius: 16,
    marginLeft: -10, // Adjusts chart-kit default padding
  },
  aiSection: {
    marginBottom: 20,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0056b3',
    marginLeft: 10,
  },
  aiScrollContent: {
    paddingRight: 20,
  },
  aiCard: {
    backgroundColor: '#ffffff',
    width: 260,
    borderRadius: 16,
    padding: 16,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#e0e6ed',
    marginBottom: 40
  },
  aiTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  aiTagText: {
    fontSize: 10,
    fontWeight: '800',
  },
  aiCardText: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 20,
    marginBottom: 15,
  },
  aiBtnAction: {
    backgroundColor: '#2c3e50',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
  },
  aiBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  }
});