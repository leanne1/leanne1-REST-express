import express from 'express';
import { debug as _debug } from 'debug';
import { validateObjectId, validateCustomer } from '../validators';
import { getInvalidErrorMessages } from '../util';
import { Customer } from '../model';

const router = express.Router();

const createCustomer = async customer => {
  const newCustomer = await new Customer(customer);
  return newCustomer.save();
};

const updateCustomer = async (id, nextValues) => {
  return await Customer.findByIdAndUpdate(id, {
    $set: nextValues,
  }, { new: true });
};

const deleteCustomer = async (id) => {
  return await Customer.findByIdAndRemove(id);
};

router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().sort('name');
    return res.send(customers);
  } catch(err) {
    return res.staus(500).send(err.message);
  }
});

router.get('/:id', async (req, res) => {
  const { params } = req;

  const invalidId = validateObjectId(params);
  if (invalidId) return res.status(400).send(getInvalidErrorMessages(invalidId));

  try {
    const customer = await Customer.findById(params.id);
    if (!customer) return res.status(404).send('Customer not found');
    return res.send(customer);
  } catch(err) {
    return res.staus(500).send(err.message);
  }
});

router.post('/', async (req, res) => {
  const { body } = req;

  const invalidCustomer = validateCustomer(body);
  if (invalidCustomer) return res.status(400).send(getInvalidErrorMessages(invalidCustomer));

  try {
    const customer = await createCustomer(body);
    return res.send(customer);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.put('/:id', async (req, res) => {
  const { params, body } = req;

  const invalidId = validateObjectId(params);
  if (invalidId) return res.status(400).send(getInvalidErrorMessages(invalidId));

  const invalidCustomer = validateCustomer(body);
  if (invalidCustomer) return res.status(400).send(getInvalidErrorMessages(invalidCustomer));

  try {
    const customer = await updateCustomer(params.id, body);
    if (!customer) res.status(404).send('Customer not found');
    return res.send(customer);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.delete('/:id', async (req, res) => {
  const { params } = req;

  const invalidId = validateObjectId(params);
  if (invalidId) return res.status(400).send(getInvalidErrorMessages(invalidId));

  try {
    const customer = await deleteCustomer(params.id);
    if (!customer) return res.status(404).send('Customer not found');
    return res.send(200);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

export default router;
