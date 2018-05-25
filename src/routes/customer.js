import express from 'express';
import { pick } from 'lodash';
import { validateCustomer } from '../validate';
import { Customer } from '../model';
import {
  authorize,
  isAdmin,
  attemptAsync,
  validObjectIdParam,
  validateBody
} from '../middleware';

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

router.get('/:id', [validObjectIdParam], attemptAsync(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send('Customer not found');
  return res.send(customer);
}));

router.post('/', [authorize, validateBody(validateCustomer)], attemptAsync(async (req, res) => {
  const customer = await createCustomer(req.body);
  return res.send(customer);
}));

router.put('/:id', [
  authorize,
  isAdmin,
  validObjectIdParam,
  validateBody(validateCustomer)
], attemptAsync(async (req, res) => {
  const customer = await updateCustomer(req.params.id, req.body);
  if (!customer) res.status(404).send('Customer not found');
  return res.send(customer);
}));

router.delete('/:id', [authorize, isAdmin, validObjectIdParam], attemptAsync(async (req, res) => {
  const customer = await deleteCustomer(req.params.id);
  if (!customer) return res.status(404).send('Customer not found');
  return res.send(200);
}));

export default router;
