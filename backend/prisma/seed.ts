import { PrismaClient, Role, Status, HealthStatus, PayoutStatus, LeadStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Clearing existing database records...');
  await prisma.b2BLead.deleteMany();
  await prisma.aMCContract.deleteMany();
  await prisma.revenueTransaction.deleteMany();
  await prisma.energyReading.deleteMany();
  await prisma.batteryUnit.deleteMany();
  await prisma.user.deleteMany();
  await prisma.society.deleteMany();

  console.log('🔑  Seeding users & credentials...');
  const adminPassword  = await bcrypt.hash('admin123',   10);
  const managerPassword = await bcrypt.hash('manager123', 10);

  // ── Admin account ──────────────────────────────────────────────────────────
  await prisma.user.create({
    data: {
      email: 'admin@storeandshare.in',
      hashedPassword: adminPassword,
      role: Role.ADMIN,
      name: 'Aditya Sharma (Global Admin)',
    },
  });

  // ── Society definitions (10 societies across 3 cities) ────────────────────
  const societiesData = [
    // ── NAGPUR ──────────────────────────────────────────────────────────────
    {
      name: 'Ganga Heights Co-op Housing Society',
      address: 'Plot 45, Shivaji Nagar, Nagpur – 440010',
      city: 'Nagpur',
      flatCount: 85,
      rooftopSolarKw: 60.0,
      dailySurplusUnits: 150.0,
      netMeteringRate: 2.2,
      discomImportRate: 8.8,
      revenueSplitCustomerPct: 60.0,
      revenueSplitCompanyPct: 40.0,
      contactPersonName: 'Vijay Deshmukh',
      contactEmail: 'nagpur1@storeandshare.in',
      contactPhone: '9876543210',
      status: Status.ACTIVE,
      internalNotes: 'First onboarded society in Nagpur. Battery health GOOD, no service calls in last 90 days. Renewal due Dec 2026.',
      hasBattery: true,
      batteryCapacityKwh: 200,
      batteryHealth: HealthStatus.GOOD,
      partner: 'PowerCube India',
      hasAmc: true,
    },
    {
      name: 'Orange City Enclave',
      address: 'Wardha Road, Near Airport, Nagpur – 440014',
      city: 'Nagpur',
      flatCount: 120,
      rooftopSolarKw: 90.0,
      dailySurplusUnits: 250.0,
      netMeteringRate: 2.0,
      discomImportRate: 8.5,
      revenueSplitCustomerPct: 60.0,
      revenueSplitCompanyPct: 40.0,
      contactPersonName: 'Neha Kulkarni',
      contactEmail: 'nagpur2@storeandshare.in',
      contactPhone: '9876543211',
      status: Status.ACTIVE,
      internalNotes: 'Largest Nagpur society by flat count. Zenith installed 300 kWh unit. Battery cell replacement done Q1 2026.',
      hasBattery: true,
      batteryCapacityKwh: 300,
      batteryHealth: HealthStatus.GOOD,
      partner: 'Zenith Storage Ltd.',
      hasAmc: true,
    },
    {
      name: 'Vindhya Residency',
      address: 'Trimurti Nagar, Nagpur – 440022',
      city: 'Nagpur',
      flatCount: 40,
      rooftopSolarKw: 30.0,
      dailySurplusUnits: 80.0,
      netMeteringRate: 2.0,
      discomImportRate: 8.5,
      revenueSplitCustomerPct: 65.0,
      revenueSplitCompanyPct: 35.0,
      contactPersonName: 'Ramesh Vyas',
      contactEmail: 'nagpur3@storeandshare.in',
      contactPhone: '9876543212',
      status: Status.ONBOARDING,
      internalNotes: 'Legal clearance pending from MSEDCL. Battery installation scheduled Q3 2026. Society committee approved unanimously.',
      hasBattery: false,
      batteryCapacityKwh: 0,
      batteryHealth: HealthStatus.GOOD,
      partner: '',
      hasAmc: false,
    },

    // ── PATNA ───────────────────────────────────────────────────────────────
    {
      name: 'Pataliputra Greens',
      address: 'Road No. 4, Pataliputra Colony, Patna – 800013',
      city: 'Patna',
      flatCount: 95,
      rooftopSolarKw: 75.0,
      dailySurplusUnits: 210.0,
      netMeteringRate: 1.8,
      discomImportRate: 7.9,
      revenueSplitCustomerPct: 60.0,
      revenueSplitCompanyPct: 40.0,
      contactPersonName: 'Sanjay Sinha',
      contactEmail: 'patna1@storeandshare.in',
      contactPhone: '9876543213',
      status: Status.ACTIVE,
      internalNotes: 'Best-performing Patna society. Bihar Bright Energy battery performing at 98% efficiency. Sanjay has been an excellent evangelist — recommended us to 3 other societies.',
      hasBattery: true,
      batteryCapacityKwh: 250,
      batteryHealth: HealthStatus.GOOD,
      partner: 'Bihar Bright Energy',
      hasAmc: true,
    },
    {
      name: 'Maurya Vihar Estate',
      address: 'Khagaul Road, Patna – 800012',
      city: 'Patna',
      flatCount: 150,
      rooftopSolarKw: 110.0,
      dailySurplusUnits: 320.0,
      netMeteringRate: 1.8,
      discomImportRate: 7.9,
      revenueSplitCustomerPct: 55.0,
      revenueSplitCompanyPct: 45.0,
      contactPersonName: 'Rakesh Ranjan',
      contactEmail: 'patna2@storeandshare.in',
      contactPhone: '9876543214',
      status: Status.ACTIVE,
      internalNotes: 'Highest revenue-generating Patna property. 55/45 split negotiated given large 400 kWh battery. BMS firmware updated May 2026.',
      hasBattery: true,
      batteryCapacityKwh: 400,
      batteryHealth: HealthStatus.WARNING,
      partner: 'Zenith Storage Ltd.',
      hasAmc: true,
    },
    {
      name: 'Nalanda View Apartment',
      address: 'Kankarbagh Colony, Patna – 800020',
      city: 'Patna',
      flatCount: 50,
      rooftopSolarKw: 35.0,
      dailySurplusUnits: 90.0,
      netMeteringRate: 1.8,
      discomImportRate: 7.9,
      revenueSplitCustomerPct: 60.0,
      revenueSplitCompanyPct: 40.0,
      contactPersonName: 'Anil Kishor',
      contactEmail: 'patna3@storeandshare.in',
      contactPhone: '9876543215',
      status: Status.PAUSED,
      internalNotes: 'Paused due to structural rooftop repairs by society. Expected to resume Sep 2026. Battery unit in storage mode.',
      hasBattery: true,
      batteryCapacityKwh: 100,
      batteryHealth: HealthStatus.GOOD,
      partner: 'PowerCube India',
      hasAmc: false,
    },

    // ── DELHI ────────────────────────────────────────────────────────────────
    {
      name: 'Pragati Vihar Society',
      address: 'Sector 12, Dwarka, New Delhi – 110078',
      city: 'Delhi',
      flatCount: 110,
      rooftopSolarKw: 80.0,
      dailySurplusUnits: 230.0,
      netMeteringRate: 2.5,
      discomImportRate: 9.5,
      revenueSplitCustomerPct: 60.0,
      revenueSplitCompanyPct: 40.0,
      contactPersonName: 'Harpreet Singh',
      contactEmail: 'delhi1@storeandshare.in',
      contactPhone: '9876543216',
      status: Status.ACTIVE,
      internalNotes: 'Flagship Delhi property. Featured in Hindustan Times article on urban solar. RWA president wants to expand to 500 kWh by 2027.',
      hasBattery: true,
      batteryCapacityKwh: 260,
      batteryHealth: HealthStatus.GOOD,
      partner: 'Indraprastha Solar Co.',
      hasAmc: true,
    },
    {
      name: 'Dwarka Greens',
      address: 'Sector 22, Dwarka, New Delhi – 110075',
      city: 'Delhi',
      flatCount: 140,
      rooftopSolarKw: 100.0,
      dailySurplusUnits: 290.0,
      netMeteringRate: 2.5,
      discomImportRate: 9.5,
      revenueSplitCustomerPct: 60.0,
      revenueSplitCompanyPct: 40.0,
      contactPersonName: 'Aman Verma',
      contactEmail: 'delhi2@storeandshare.in',
      contactPhone: '9876543217',
      status: Status.ACTIVE,
      internalNotes: 'Second-largest Delhi site. Aman is ex-IIT and deeply technically engaged. Wants monthly telemetry email reports.',
      hasBattery: true,
      batteryCapacityKwh: 320,
      batteryHealth: HealthStatus.GOOD,
      partner: 'Zenith Storage Ltd.',
      hasAmc: true,
    },
    {
      name: 'Mayur Regency',
      address: 'Mayur Vihar Phase I, New Delhi – 110091',
      city: 'Delhi',
      flatCount: 65,
      rooftopSolarKw: 45.0,
      dailySurplusUnits: 130.0,
      netMeteringRate: 2.5,
      discomImportRate: 9.5,
      revenueSplitCustomerPct: 60.0,
      revenueSplitCompanyPct: 40.0,
      contactPersonName: 'Meenakshi Iyer',
      contactEmail: 'delhi3@storeandshare.in',
      contactPhone: '9876543218',
      status: Status.ONBOARDING,
      internalNotes: 'BRPL meter approval in progress. Sales visit completed July 2026. Meenakshi wants contract finalised by Aug 2026.',
      hasBattery: false,
      batteryCapacityKwh: 0,
      batteryHealth: HealthStatus.GOOD,
      partner: '',
      hasAmc: false,
    },
    {
      name: 'Chanakya Courts',
      address: 'Chanakyapuri Enclave, New Delhi – 110021',
      city: 'Delhi',
      flatCount: 75,
      rooftopSolarKw: 60.0,
      dailySurplusUnits: 170.0,
      netMeteringRate: 2.5,
      discomImportRate: 9.5,
      revenueSplitCustomerPct: 70.0,
      revenueSplitCompanyPct: 30.0,
      contactPersonName: 'Vikram Seth',
      contactEmail: 'delhi4@storeandshare.in',
      contactPhone: '9876543219',
      status: Status.ACTIVE,
      internalNotes: 'Premium diplomatic enclave — RWA negotiated 70/30 split citing premium land value. 200 kWh Indraprastha unit installed Jan 2026.',
      hasBattery: true,
      batteryCapacityKwh: 200,
      batteryHealth: HealthStatus.GOOD,
      partner: 'Indraprastha Solar Co.',
      hasAmc: true,
    },
  ];

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // Emails that get a login account (one per city chapter)
  const managerLoginEmails = [
    'nagpur1@storeandshare.in',
    'patna1@storeandshare.in',
    'delhi1@storeandshare.in',
  ];

  for (let idx = 0; idx < societiesData.length; idx++) {
    const s = societiesData[idx];
    console.log(`  📍 Seeding society [${idx + 1}/${societiesData.length}]: ${s.name} (${s.city})`);

    const createdSociety = await prisma.society.create({
      data: {
        name: s.name,
        address: s.address,
        city: s.city,
        flatCount: s.flatCount,
        rooftopSolarKw: s.rooftopSolarKw,
        dailySurplusUnits: s.dailySurplusUnits,
        netMeteringRate: s.netMeteringRate,
        discomImportRate: s.discomImportRate,
        revenueSplitCustomerPct: s.revenueSplitCustomerPct,
        revenueSplitCompanyPct: s.revenueSplitCompanyPct,
        contactPersonName: s.contactPersonName,
        contactEmail: s.contactEmail,
        contactPhone: s.contactPhone,
        status: s.status,
        internalNotes: s.internalNotes,
      },
    });

    // Create manager login for designated city-head accounts
    if (managerLoginEmails.includes(s.contactEmail)) {
      await prisma.user.create({
        data: {
          email: s.contactEmail,
          hashedPassword: managerPassword,
          role: Role.SOCIETY_MANAGER,
          name: `${s.contactPersonName} (${s.city} Manager)`,
          societyId: createdSociety.id,
        },
      });
      console.log(`     ✅ Manager login created: ${s.contactEmail} / manager123`);
    }

    // Battery unit
    if (s.hasBattery) {
      await prisma.batteryUnit.create({
        data: {
          societyId: createdSociety.id,
          manufacturerPartner: s.partner,
          capacityKwh: s.batteryCapacityKwh,
          leaseOrRevShareTerms: `${s.revenueSplitCompanyPct}% / ${s.revenueSplitCustomerPct}% Revenue Share`,
          installDate: new Date(now.getTime() - 120 * 86400000),
          healthStatus: s.batteryHealth,
          lastServiceDate: new Date(now.getTime() - 30 * 86400000),
          nextMaintenanceDue: new Date(now.getTime() + 60 * 86400000),
        },
      });
    }

    // Energy readings + monthly revenue (only for ACTIVE / PAUSED societies)
    if (s.status === Status.ACTIVE || s.status === Status.PAUSED) {
      const readings: any[] = [];
      const monthBuckets: { [key: string]: { surplus: number; stored: number; used: number; exported: number }[] } = {};
      const DAYS = 90; // 90 days of history for richer data

      for (let d = DAYS; d >= 1; d--) {
        const readingDate = new Date(now.getTime() - d * 86400000);

        // Seasonal + weekday fluctuation
        const seasonal  = Math.sin((d / 30.0) * Math.PI) * 0.12;
        const random    = (Math.random() * 0.18) - 0.09;
        const dailySurplus = Math.max(
          10,
          Math.round(s.dailySurplusUnits * (1 + seasonal + random) * 10) / 10,
        );

        const storeRatio = 0.60 + Math.random() * 0.12;
        const stored   = Math.round(dailySurplus * storeRatio * 10) / 10;
        const exported = Math.round((dailySurplus - stored) * 10) / 10;
        const used     = Math.round(stored * 0.94 * 10) / 10;   // 94% round-trip efficiency

        readings.push({
          societyId: createdSociety.id,
          date: readingDate,
          surplusUnitsGenerated: dailySurplus,
          unitsStoredInBattery: stored,
          unitsUsedFromBattery: used,
          unitsExportedToGrid: exported,
        });

        const monthKey = `${readingDate.getFullYear()}-${String(readingDate.getMonth() + 1).padStart(2, '0')}`;
        if (!monthBuckets[monthKey]) monthBuckets[monthKey] = [];
        monthBuckets[monthKey].push({ surplus: dailySurplus, stored, used, exported });
      }

      await prisma.energyReading.createMany({ data: readings });

      // Monthly revenue transactions
      for (const [monthKey, days] of Object.entries(monthBuckets)) {
        const [yr, mo] = monthKey.split('-').map(Number);
        const txDate = new Date(yr, mo - 1, 1);

        const totalSurplus = days.reduce((a, d) => a + d.surplus, 0);
        const baselineValue = Math.round(totalSurplus * s.netMeteringRate * 100) / 100;
        const platformValue = Math.round(totalSurplus * s.discomImportRate * 100) / 100;
        const extraValueCreated = Math.round((platformValue - baselineValue) * 100) / 100;
        const customerEarning   = Math.round(extraValueCreated * (s.revenueSplitCustomerPct / 100) * 100) / 100;
        const companyRevenue    = Math.round(extraValueCreated * (s.revenueSplitCompanyPct  / 100) * 100) / 100;

        // Mark as PAID if the month ended more than 15 days ago
        const monthEnd = new Date(yr, mo, 0);
        const isPaid = (now.getTime() - monthEnd.getTime()) > 15 * 86400000;

        await prisma.revenueTransaction.create({
          data: {
            societyId: createdSociety.id,
            date: txDate,
            baselineValue,
            platformValue,
            extraValueCreated,
            customerEarning,
            companyRevenue,
            payoutStatus: isPaid ? PayoutStatus.PAID : PayoutStatus.PENDING,
          },
        });
      }

      // AMC contract for qualifying societies
      if (s.hasAmc) {
        await prisma.aMCContract.create({
          data: {
            societyId: createdSociety.id,
            monthlyFee: s.flatCount * 10,        // ₹10 per flat/month
            startDate: new Date(now.getTime() - 120 * 86400000),
            renewalDate: new Date(now.getTime() + 245 * 86400000),
            status: Status.ACTIVE,
            lastMaintenanceCheck: new Date(now.getTime() - 15 * 86400000),
            nextMaintenanceDue:   new Date(now.getTime() + 15 * 86400000),
          },
        });
      }
    }
  }

  // ── B2B CRM Leads (10 realistic pipeline entries) ─────────────────────────
  console.log('\n📋  Seeding B2B CRM pipeline leads...');
  await prisma.b2BLead.createMany({
    data: [
      {
        companyName: 'Loom Solar Solutions Pvt. Ltd.',
        contactEmail: 'partner@loomsolar.com',
        interestType: 'SOFTWARE_LICENSE',
        status: LeadStatus.NEW,
        notes: 'Interested in licensing the BMS optimization AI module for their upcoming 200-unit residential microgrids project in Noida Extension.',
      },
      {
        companyName: 'Tata Power Residential Club',
        contactEmail: 'collab@tatapowerresidences.com',
        interestType: 'PARTNERSHIP',
        status: LeadStatus.CONTACTED,
        notes: 'Joint battery financing + developer revenue share model for high-density Mumbai & Pune society clusters (500+ flats each).',
      },
      {
        companyName: 'Adani Renewables East',
        contactEmail: 'leads@adanirenewables.in',
        interestType: 'AMC',
        status: LeadStatus.CONVERTED,
        notes: 'Signed MOU July 2026. Annual maintenance support for 15 experimental battery storage sites across Kolkata & Bhubaneswar.',
      },
      {
        companyName: 'ReNew Power Microgrids',
        contactEmail: 'partnerships@renewpower.com',
        interestType: 'PARTNERSHIP',
        status: LeadStatus.CONTACTED,
        notes: 'ReNew wants to co-invest in battery hardware for 30 societies in Hyderabad. Revenue split to be negotiated — currently at 50/50 proposal.',
      },
      {
        companyName: 'Waaree Energies Ltd.',
        contactEmail: 'business@waaree.com',
        interestType: 'SOFTWARE_LICENSE',
        status: LeadStatus.NEW,
        notes: 'Waaree installs 8 MW+ of residential solar per quarter across Tier 2 cities. Interested in bundling Store & Share platform with panel orders.',
      },
      {
        companyName: 'NoBroker Housing Solutions',
        contactEmail: 'operations@nobroker.in',
        interestType: 'PARTNERSHIP',
        status: LeadStatus.NEW,
        notes: 'NoBroker manages 1200+ societies digitally. Exploring deep API integration to offer Store & Share as a value-add to their society admin dashboard.',
      },
      {
        companyName: 'L&T EnerTech',
        contactEmail: 'energy@lnt.in',
        interestType: 'AMC',
        status: LeadStatus.CONTACTED,
        notes: 'L&T wants white-label AMC branding rights for their construction subsidiaries. Six-month pilot for 5 L&T-built residentials in Chennai.',
      },
      {
        companyName: 'MyGate Society Platform',
        contactEmail: 'bd@mygate.com',
        interestType: 'SOFTWARE_LICENSE',
        status: LeadStatus.CONVERTED,
        notes: 'SaaS integration finalised. MyGate will display monthly revenue credit notifications in their society manager app for Store & Share enrolled societies.',
      },
      {
        companyName: 'Hero Future Energies',
        contactEmail: 'biz@herofutureenergies.com',
        interestType: 'PARTNERSHIP',
        status: LeadStatus.LOST,
        notes: 'Negotiations stalled over DISCOM tariff assumptions. Hero wants 55% company take — not viable under our current model. Revisit Q2 2027.',
      },
      {
        companyName: 'Migsun Group (Lucknow)',
        contactEmail: 'solar@migsun.com',
        interestType: 'AMC',
        status: LeadStatus.NEW,
        notes: 'Large builder in Lucknow with 4 under-construction society projects. Wants to pre-install battery infrastructure before possession handover.',
      },
    ],
  });

  console.log('\n✅  Database seeding completed successfully!');
  console.log('');
  console.log('  ADMIN  : admin@storeandshare.in        pw: admin123');
  console.log('  NAGPUR : nagpur1@storeandshare.in      pw: manager123');
  console.log('  PATNA  : patna1@storeandshare.in       pw: manager123');
  console.log('  DELHI  : delhi1@storeandshare.in       pw: manager123');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌  Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
