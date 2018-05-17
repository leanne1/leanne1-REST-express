import express from 'express';
import { pick } from 'lodash';
import { validateObjectId, validateCustomer } from '../validate';
import { getInvalidErrorMessages } from '../util';
import { Customer } from '../model';
import { authorize, isAdmin, attemptAsync } from '../middleware';

const router = express.Router();

const getCustomerInput = customer => ({ ...pick(customer, ['name', 'isGold', 'phone']) });

const createCustomer = customer => {
  const newCustomer = new Customer(getCustomerInput(customer));
  return newCustomer.save();
};

const updateCustomer = async (id, customer) => {
  return await Customer.findByIdAndUpdate(id, {
    $set: getCustomerInput(customer),
  }, { new: true });
};

const deleteCustomer = async (id) => {
  return await Customer.findByIdAndRemove(id);
};

router.get('/', attemptAsync(async (req, res) => {
  const customers = await Customer.find().sort('name');
  return res.send(customers);
}));

router.get('/:id', attemptAsync(async (req, res) => {
  const { params } = req;

  const invalidId = validateObjectId(params);
  if (invalidId) return res.status(400).send(getInvalidErrorMessages(invalidId));

  const customer = await Customer.findById(params.id);
  if (!customer) return res.status(404).send('Customer not found');
  return res.send(customer);

}));

router.post('/', authorize, attemptAsync(async (req, res) => {
  const { body } = req;

  const invalidCustomer = validateCustomer(body);
  if (invalidCustomer) return res.status(400).send(getInvalidErrorMessages(invalidCustomer));

  const customer = await createCustomer(body);
  return res.send(customer);
}));

router.put('/:id', [authorize, isAdmin], attemptAsync(async (req, res) => {
  const { params, body } = req;

  const invalidId = validateObjectId(params);
  if (invalidId) return res.status(400).send(getInvalidErrorMessages(invalidId));

  const invalidCustomer = validateCustomer(body);
  if (invalidCustomer) return res.status(400).send(getInvalidErrorMessages(invalidCustomer));

  const customer = await updateCustomer(params.id, body);
  if (!customer) res.status(404).send('Customer not found');
  return res.send(customer);
}));

router.delete('/:id', [authorize, isAdmin], attemptAsync(async (req, res) => {
  const { params } = req;

  const invalidId = validateObjectId(params);
  if (invalidId) return res.status(400).send(getInvalidErrorMessages(invalidId));

  const customer = await deleteCustomer(params.id);
  if (!customer) return res.status(404).send('Customer not found');
  return res.send(200);
}));

export default router;
