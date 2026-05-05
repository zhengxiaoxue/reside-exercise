const express = require('express');
const router = express.Router();
const sequelize = require('../storage/database');
const defineInfectionData = require('../models/InfectionData');
const defineInfectionDataMetadata = require('../models/InfectionDataMetadata');
const { InfectionDataQuery } = require('../models/InfectionDataQuery');
const InfectionData = defineInfectionData(sequelize);
const InfectionDataMetadata = defineInfectionDataMetadata(sequelize);

router.get('/infection-data', async (req, res) => {
  const q = new InfectionDataQuery(req.query);
  q.validate();

  const result = await InfectionData.findAndCountAll(q.toSequelizeOptions());

  res.json({
    data: result.rows,
    pagination: {
      page: q.page,
      pageSize: q.pageSize,
      totalItems: result.count,
      totalPages: Math.ceil(result.count / q.pageSize)
    }
  });
});

router.get('/infection-metadata', async (req, res) => {
  const metadata = await InfectionDataMetadata.findAll();
  res.json(metadata);
});


module.exports = router;