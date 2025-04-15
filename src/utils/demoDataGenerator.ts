import { v4 as uuidv4 } from 'uuid';
import { addDays, format, subDays } from 'date-fns';
import { 
  generateTraderName, 
  generateBrokerName, 
  generateIndianLotNumber, 
  generateVakkalNumber, 
  generateApproximateWeight, 
  getRandomItem,
  titleCase 
} from './dataGeneratorHelpers';
import { 
  addAgent, 
  addBroker, 
  addCustomer, 
  addSupplier, 
  addTransporter,
  addPurchase,
  addSale,
  addPayment,
  addReceipt,
  addInventoryItem,
  updateAgentBalance
} from '@/services/storageService';
import { getActiveFinancialYear } from '@/services/financialYearService';
import { Customer, FinancialYear } from '@/services/types';

// Function to generate sample data
export async function generateSampleData(): Promise<{
  purchaseCount: number;
  saleCount: number;
  paymentCount: number;
  receiptCount: number;
  totalCount: number;
  csvUrl: string;
}> {
  const activeYear = getActiveFinancialYear();
  if (!activeYear) {
    throw new Error("No active financial year found.");
  }

  const startDate = new Date(activeYear.startDate);
  const endDate = new Date(activeYear.endDate);

  const agents = [];
  const brokers = [];
  const customers = [];
  const suppliers = [];
  const transporters = [];

  // Generate master data
  for (let i = 0; i < 5; i++) {
    const agent = {
      id: uuidv4(),
      name: generateTraderName(),
      phone: `9876543${i}${i}${i}`,
      address: `Address ${i}`,
      rate: Math.random() * 5,
      balance: 0,
      isDeleted: false,
    };
    agents.push(agent);
    addAgent(agent);

    const broker = {
      id: uuidv4(),
      name: generateBrokerName(),
      phone: `8765432${i}${i}${i}`,
      address: `Address ${i}`,
      rate: Math.random() * 2,
      balance: 0,
      isDeleted: false,
    };
    brokers.push(broker);
    addBroker(broker);

    const customer: Customer = {
      id: uuidv4(),
      name: generateTraderName(),
      phone: `7654321${i}${i}${i}`,
      address: `Address ${i}`,
      payableByCustomer: Math.random() > 0.5,
      balance: 0,
      isDeleted: false,
    };
    customers.push(customer);
    addCustomer(customer);

    const supplier = {
      id: uuidv4(),
      name: generateTraderName(),
      phone: `6543210${i}${i}${i}`,
      address: `Address ${i}`,
      balance: 0,
      isDeleted: false,
    };
    suppliers.push(supplier);
    addSupplier(supplier);

    const transporter = {
      id: uuidv4(),
      name: generateTraderName(),
      phone: `5432109${i}${i}${i}`,
      address: `Address ${i}`,
      balance: 0,
      isDeleted: false,
    };
    transporters.push(transporter);
    addTransporter(transporter);
  }

  let purchaseCount = 0;
  let saleCount = 0;
  let paymentCount = 0;
  let receiptCount = 0;

  const records = [];

  // Generate transactions
  for (let i = 0; i < 50; i++) {
    const purchaseDate = format(
      new Date(
        startDate.getTime() +
          Math.random() * (endDate.getTime() - startDate.getTime())
      ),
      "yyyy-MM-dd"
    );
    const agent = getRandomItem(agents);
    const supplier = getRandomItem(suppliers);
    const lotNumber = generateIndianLotNumber();
    const quantity = Math.floor(Math.random() * 100) + 1;
    const netWeight = generateApproximateWeight(quantity);
    const rate = Math.floor(Math.random() * 5000) + 1000;
    const expenses = Math.floor(Math.random() * 1000);
    const totalAmount = quantity * rate;
    const totalAfterExpenses = totalAmount + expenses;

    const purchase = {
      id: uuidv4(),
      date: purchaseDate,
      lotNumber: lotNumber,
      quantity: quantity,
      netWeight: netWeight,
      rate: rate,
      totalAmount: totalAmount,
      expenses: expenses,
      totalAfterExpenses: totalAfterExpenses,
      agent: agent.name,
      agentId: agent.id,
      party: supplier.name,
      partyId: supplier.id,
      brokerageRate: 0,
      brokerageAmount: 0,
      brokerageType: "percentage",
      broker: null,
      brokerId: null,
      transporter: null,
      transporterId: null,
      transportRate: 0,
      transportCost: 0,
      location: "Warehouse",
      notes: "Sample purchase",
      isDeleted: false,
    };
    addPurchase(purchase);
    purchaseCount++;

    // Add to inventory
    addInventoryItem({
      id: uuidv4(),
      lotNumber: lotNumber,
      quantity: quantity,
      location: "Warehouse",
      dateAdded: purchaseDate,
      netWeight: netWeight,
      rate: rate,
      isDeleted: false,
    });

    updateAgentBalance(agent.id, -totalAfterExpenses);

    records.push({
      type: "Purchase",
      ...purchase,
    });
  }

  for (let i = 0; i < 50; i++) {
    const saleDate = format(
      new Date(
        startDate.getTime() +
          Math.random() * (endDate.getTime() - startDate.getTime())
      ),
      "yyyy-MM-dd"
    );
    const customer = getRandomItem(customers);
    const broker = getRandomItem(brokers);
    const lotNumber = generateIndianLotNumber();
    const quantity = Math.floor(Math.random() * 50) + 1;
    const netWeight = generateApproximateWeight(quantity);
    const rate = Math.floor(Math.random() * 6000) + 2000;
    const totalAmount = quantity * rate;
    const transportCost = Math.floor(Math.random() * 500);
    const netAmount = totalAmount - transportCost;

    const sale = {
      id: uuidv4(),
      date: saleDate,
      lotNumber: lotNumber,
      billNumber: generateVakkalNumber(),
      billAmount: totalAmount,
      customer: customer.name,
      customerId: customer.id,
      quantity: quantity,
      netWeight: netWeight,
      rate: rate,
      totalAmount: totalAmount,
      transportCost: transportCost,
      netAmount: netAmount,
      broker: broker ? broker.name : null,
      brokerId: broker ? broker.id : null,
      brokerageRate: broker ? broker.rate : 0,
      brokerageAmount: broker ? totalAmount * (broker.rate / 100) : 0,
      brokerageType: "percentage",
      transporter: null,
      transporterId: null,
      transportRate: 0,
      location: "Warehouse",
      notes: "Sample sale",
      isDeleted: false,
      amount: totalAmount,
    };
    addSale(sale);
    saleCount++;

    records.push({
      type: "Sale",
      ...sale,
    });
  }

  for (let i = 0; i < 50; i++) {
    const paymentDate = format(
      new Date(
        startDate.getTime() +
          Math.random() * (endDate.getTime() - startDate.getTime())
      ),
      "yyyy-MM-dd"
    );
    const agent = getRandomItem(agents);

    const payment = {
      id: uuidv4(),
      date: paymentDate,
      amount: Math.floor(Math.random() * 1000) + 100,
      partyId: agent.id,
      partyName: agent.name,
      partyType: "agent",
      reference: generateVakkalNumber(),
      paymentMethod: "Cash",
      notes: "Sample payment",
      isDeleted: false,
    };
    addPayment(payment);
    paymentCount++;

    records.push({
      type: "Payment",
      ...payment,
    });
  }

  for (let i = 0; i < 50; i++) {
    const receiptDate = format(
      new Date(
        startDate.getTime() +
          Math.random() * (endDate.getTime() - startDate.getTime())
      ),
      "yyyy-MM-dd"
    );
    const customer = getRandomItem(customers);

    const receipt = {
      id: uuidv4(),
      date: receiptDate,
      amount: Math.floor(Math.random() * 1000) + 100,
      customerId: customer.id,
      customerName: customer.name,
      reference: generateVakkalNumber(),
      paymentMethod: "Cash",
      notes: "Sample receipt",
      isDeleted: false,
    };
    addReceipt(receipt);
    receiptCount++;

    records.push({
      type: "Receipt",
      ...receipt,
    });
  }

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [
      [
        "Type",
        "Date",
        "Lot Number",
        "Quantity",
        "Net Weight",
        "Rate",
        "Total Amount",
        "Expenses",
        "Total After Expenses",
        "Agent",
        "Party",
      ],
      ...records.map((record) => [
        record.type,
        record.date,
        record.lotNumber,
        record.quantity,
        record.netWeight,
        record.rate,
        record.totalAmount,
        record.expenses,
        record.totalAfterExpenses,
        record.agent,
        record.party,
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

  const csvUrl = encodeURI(csvContent);

  const link = document.createElement("a");
  link.setAttribute("href", csvUrl);
  link.setAttribute("download", "sample_data.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return {
    purchaseCount,
    saleCount,
    paymentCount,
    receiptCount,
    totalCount: purchaseCount + saleCount + paymentCount + receiptCount,
    csvUrl,
  };
}
