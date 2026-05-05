const { Op } = require('sequelize');

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

class InfectionDataQuery {
  constructor(query) {
    this.admin0Id = query.admin0Id;
    this.indicator = query.indicator;
    this.admin1Id = query.admin1Id;
    this.summaryTypeId = query.summaryTypeId;
    this.sortBy = query.sortBy;
    this.sortOrder = (query.sortOrder || 'ASC').toUpperCase();

    this.page = Number.parseInt(query.page || '1', 10);
    this.pageSize = Number.parseInt(query.pageSize || '50', 10);

    this.minValue = query.minValue !== undefined ? Number.parseFloat(query.minValue) : undefined;
    this.maxValue = query.maxValue !== undefined ? Number.parseFloat(query.maxValue) : undefined;
  }

  validate() {
    if (!this.admin0Id) throw new ValidationError('Missing required query parameter: admin0Id');
    if (!this.indicator) throw new ValidationError('Missing required query parameter: indicator');

    if (!Number.isInteger(this.page) || this.page < 1) {
      throw new ValidationError('Query parameter page must be an integer greater than 0');
    }
    if (!Number.isInteger(this.pageSize) || this.pageSize < 1 || this.pageSize > 500) {
      throw new ValidationError('Query parameter pageSize must be an integer between 1 and 500');
    }

    if ((this.minValue !== undefined || this.maxValue !== undefined || this.sortBy === 'value') && !this.summaryTypeId) {
      throw new ValidationError('Query parameter summaryTypeId is required when using minValue/maxValue or sortBy=value');
    }

    if (this.sortBy && this.sortBy !== 'value') {
      throw new ValidationError('Query parameter sortBy only supports value');
    }

    if (this.sortOrder !== 'ASC' && this.sortOrder !== 'DESC') {
      throw new ValidationError('Query parameter sortOrder must be ASC or DESC');
    }

    if (this.minValue !== undefined && Number.isNaN(this.minValue)) {
      throw new ValidationError('Query parameter minValue must be a valid number');
    }
    if (this.maxValue !== undefined && Number.isNaN(this.maxValue)) {
      throw new ValidationError('Query parameter maxValue must be a valid number');
    }
    if (this.minValue !== undefined && this.maxValue !== undefined && this.minValue > this.maxValue) {
      throw new ValidationError('Query parameter minValue cannot be greater than maxValue');
    }
  }

  toSequelizeOptions() {
    const where = {
      admin0Id: this.admin0Id,
      indicatorId: this.indicator
    };

    if (this.admin1Id) where.admin1Id = this.admin1Id;
    if (this.summaryTypeId) where.summaryTypeId = this.summaryTypeId;

    if (this.minValue !== undefined || this.maxValue !== undefined) {
      where.value = {};
      if (this.minValue !== undefined) where.value[Op.gte] = this.minValue;
      if (this.maxValue !== undefined) where.value[Op.lte] = this.maxValue;
    }

    const options = {
      where,
      limit: this.pageSize,
      offset: (this.page - 1) * this.pageSize
    };

    if (this.sortBy === 'value') {
      options.order = [['value', this.sortOrder]];
    }

    return options;
  }
}

module.exports = { InfectionDataQuery, ValidationError };
