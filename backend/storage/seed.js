const assert = require('node:assert/strict');
const exerciseData = require('./exerciseData.json');
const exerciseMetadata = require('./exerciseMetadata.json');
const sequelize = require('./database');
const defineInfectionData = require('../models/InfectionData');
const defineInfectionDataMetadata = require('../models/InfectionDataMetadata');
const InfectionData = defineInfectionData(sequelize);
const InfectionDataMetadata = defineInfectionDataMetadata(sequelize);

async function seed() {
  console.log('Seeding database...');
  const startTime = new Date();
  await sequelize.sync({ force: true });

  await seedMetadata();
  
  await seedInfectionData();

  console.log('Database seeding completed. elapsed time:', new Date() - startTime, 'ms');

}

async function seedMetadata() {
  const metadataRecords = [
    { id: 'admin0Label', label: exerciseMetadata.admin0Label, group: 'locationLabel', description: null },
    { id: 'admin1Label', label: exerciseMetadata.admin2Label, group: 'locationLabel', description: null },
    ...exerciseMetadata.summaryTypes.map(({ id, label }) => ({ id, label, group: 'summaryType', description: null })),
    ...exerciseMetadata.ageGroups.map(({ id, label }) => ({ id, label, group: 'ageGroup', description: null })),
    ...exerciseMetadata.indicators.map(({ id, label, description }) => ({ id, label, group: 'indicator', description: description || null })),
  ];

  await InfectionDataMetadata.bulkCreate(metadataRecords, { logging: false });
  const insertedMetadataCount = await InfectionDataMetadata.count();
  assert.equal(
    insertedMetadataCount,
    metadataRecords.length,
    `Metadata insert count mismatch: expected ${metadataRecords.length}, got ${insertedMetadataCount}`
  );
  console.log(`Inserted ${metadataRecords.length} metadata records.`);
}

async function seedInfectionData() {
 const infectionRecords = exerciseData.map((row) => {
    let indicatorId, value, ageGroupId;
    if ('hospitalAdmissions' in row) {
      indicatorId = 'hospitalAdmissions';
      value = row.hospitalAdmissions;
      ageGroupId = row.age;
    } else if ('forceOfInfection' in row) {
      indicatorId = 'forceOfInfection';
      value = row.forceOfInfection;
      ageGroupId = null;
    } else {
      indicatorId = 'prevalenceAmong9YearOlds';
      value = row.prevalenceAmong9YearOlds;
      ageGroupId = null;
    }
    const id = `${row.admin0Id}_${row.admin2Id}_${row.summaryType}_${indicatorId}_${ageGroupId ?? 'all'}`;
    return {
      id,
      admin0Id: row.admin0Id,
      admin1Id: row.admin2Id,
      summaryTypeId: row.summaryType,
      indicatorId,
      ageGroupId,
      value,
    };
  });
  await InfectionData.bulkCreate(infectionRecords, { logging: false });
  const insertedInfectionDataCount = await InfectionData.count();
  assert.equal(
    insertedInfectionDataCount,
    infectionRecords.length,
    `Infection data insert count mismatch: expected ${infectionRecords.length}, got ${insertedInfectionDataCount}`
  );
  console.log(`Inserted ${infectionRecords.length} infection data records.`);
}

module.exports = seed;