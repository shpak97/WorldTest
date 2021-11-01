import mocha from "mocha";
import "mocha/mocha.css";
/*

	Please write the implementation for the logic described below. Don't try to rush,
	and don't try to polish your solution either. I'd prefer to see a good sane implementation,
	just like you would do that if it was a real task for a real project.


	# Logic

		There is a set of Power Plants and a set of Households. Every Household can be
		connected to any number of Power Plants. Power Plant feeds the Household with the
		Electricity. The Household has Electricity if it's connected to one or more
		Power Plants.

		Each Power Plant is alive by default, but can be killed. The Power Plant which
		is not Alive will not generate any Electricity.

		Household can be connected to Household. The Household which has the Electricity
		also passes it to all the connected Households.

		The Power Plant can be repaired after killed.


	# Our expectations

		While I expect that you will treat that just like any other ticket in your
		real project, I also wanted to share some of our expectations. These expectations
		are relevant in our project on a daily basis anyways.

		1. I expect your solution to be so easy to understand that even my grannie will understand it.
		2. I exect your abstractions to be solid and clean.
		3. I expect your code to be easy to read.
		4. I expect your solution to be sane and align with common sense.
*/

//	This class is just a facade for your implementation, the tests below are using the `World` class only.
//	Feel free to add the data and behavior, but don't change the public interface.

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const generateId = () => `${Date.now()}--${getRandomInt(0, 999999)}`;

class World {

 createPowerPlant() {
  return {
   id: generateId(),
   status: 'active'
  };
 }

 createHousehold() {
  return {
   id: generateId(),
   powerPlants: []
  }
 }

 connectHouseholdToPowerPlant(household, powerPlant) {
  household.powerPlants.push(powerPlant);
 }

 connectHouseholdToHousehold(household1, household2) {
  const uniqPowerPlanets = [...household1.powerPlants, ...household2.powerPlants]
    .filter((powerPlant, i, arr) => i === arr.findIndex(({id}) => id === powerPlant.id));
  household1.powerPlants = uniqPowerPlanets;
  household2.powerPlants = uniqPowerPlanets;
 }

 disconnectHouseholdFromPowerPlant(household, powerPlant) {
  household.powerPlants.forEach((item) => {
   if (item.id === powerPlant.id) {
    item.status = 'disconnect'
   }
  })
 }

 killPowerPlant(powerPlant) {
  powerPlant.status = 'kill';
 }

 repairPowerPlant(powerPlant) {
  powerPlant.status = 'active';
 }

 householdHasEletricity(household) {
  return household.powerPlants.some(({status}) => status === 'active');
 }
}

const assert = {
 equal(a, b) {
  if (a != b) {
   throw new Error("Assertion Failed");
  }
 }
};

/*

	The code below tests your implementation. You can consider the task finished
	when all the test do pass. Feel free to read the tests, but please don't alter them.

*/

window.mocha.setup("bdd");

describe("Households + Power Plants", function() {
 it("Household has no electricity by default", () => {
  const world = new World();
  const household = world.createHousehold();
  assert.equal(world.householdHasEletricity(household), false);
 });

 it("Household has electricity if connected to a Power Plant", () => {
  const world = new World();
  const household = world.createHousehold();
  const powerPlant = world.createPowerPlant();

  world.connectHouseholdToPowerPlant(household, powerPlant);

  assert.equal(world.householdHasEletricity(household), true);
 });

 it("Household won't have Electricity after disconnecting from the only Power Plant", () => {
  const world = new World();
  const household = world.createHousehold();
  const powerPlant = world.createPowerPlant();

  world.connectHouseholdToPowerPlant(household, powerPlant);

  assert.equal(world.householdHasEletricity(household), true);

  world.disconnectHouseholdFromPowerPlant(household, powerPlant);
  assert.equal(world.householdHasEletricity(household), false);
 });

 it("Household will have Electricity as long as there's at least 1 alive Power Plant connected", () => {
  const world = new World();
  const household = world.createHousehold();

  const powerPlant1 = world.createPowerPlant();
  const powerPlant2 = world.createPowerPlant();
  const powerPlant3 = world.createPowerPlant();

  world.connectHouseholdToPowerPlant(household, powerPlant1);
  world.connectHouseholdToPowerPlant(household, powerPlant2);
  world.connectHouseholdToPowerPlant(household, powerPlant3);

  assert.equal(world.householdHasEletricity(household), true);
  world.disconnectHouseholdFromPowerPlant(household, powerPlant1);
  assert.equal(world.householdHasEletricity(household), true);

  world.killPowerPlant(powerPlant2);
  assert.equal(world.householdHasEletricity(household), true);

  world.disconnectHouseholdFromPowerPlant(household, powerPlant3);

  assert.equal(world.householdHasEletricity(household), false);
 });

 it("Household won't have Electricity if the only Power Plant dies", () => {
  const world = new World();
  const household = world.createHousehold();
  const powerPlant = world.createPowerPlant();

  world.connectHouseholdToPowerPlant(household, powerPlant);

  assert.equal(world.householdHasEletricity(household), true);

  world.killPowerPlant(powerPlant);
  assert.equal(world.householdHasEletricity(household), false);
 });

 it("PowerPlant can be repaired", () => {
  const world = new World();
  const household = world.createHousehold();
  const powerPlant = world.createPowerPlant();

  world.connectHouseholdToPowerPlant(household, powerPlant);

  assert.equal(world.householdHasEletricity(household), true);

  world.killPowerPlant(powerPlant);
  assert.equal(world.householdHasEletricity(household), false);

  world.repairPowerPlant(powerPlant);
  assert.equal(world.householdHasEletricity(household), true);

  world.killPowerPlant(powerPlant);
  assert.equal(world.householdHasEletricity(household), false);

  world.repairPowerPlant(powerPlant);
  assert.equal(world.householdHasEletricity(household), true);
 });

 it("Few Households + few Power Plants, case 1", () => {
  const world = new World();

  const household1 = world.createHousehold();
  const household2 = world.createHousehold();

  const powerPlant1 = world.createPowerPlant();
  const powerPlant2 = world.createPowerPlant();

  world.connectHouseholdToPowerPlant(household1, powerPlant1);
  world.connectHouseholdToPowerPlant(household1, powerPlant2);
  world.connectHouseholdToPowerPlant(household2, powerPlant2);

  assert.equal(world.householdHasEletricity(household1), true);
  assert.equal(world.householdHasEletricity(household2), true);

  world.killPowerPlant(powerPlant2);
  assert.equal(world.householdHasEletricity(household1), true);
  assert.equal(world.householdHasEletricity(household2), false);

  world.killPowerPlant(powerPlant1);
  assert.equal(world.householdHasEletricity(household1), false);
  assert.equal(world.householdHasEletricity(household2), false);
 });

 it("Few Households + few Power Plants, case 2", () => {
  const world = new World();

  const household1 = world.createHousehold();
  const household2 = world.createHousehold();

  const powerPlant1 = world.createPowerPlant();
  const powerPlant2 = world.createPowerPlant();

  world.connectHouseholdToPowerPlant(household1, powerPlant1);
  world.connectHouseholdToPowerPlant(household1, powerPlant2);
  world.connectHouseholdToPowerPlant(household2, powerPlant2);

  world.disconnectHouseholdFromPowerPlant(household2, powerPlant2);

  assert.equal(world.householdHasEletricity(household1), true);
  assert.equal(world.householdHasEletricity(household2), false);

  world.killPowerPlant(powerPlant2);
  assert.equal(world.householdHasEletricity(household1), true);
  assert.equal(world.householdHasEletricity(household2), false);

  world.killPowerPlant(powerPlant1);
  assert.equal(world.householdHasEletricity(household1), false);
  assert.equal(world.householdHasEletricity(household2), false);
 });

 it("Household + Power Plant, case 1", () => {
  const world = new World();

  const household = world.createHousehold();
  const powerPlant = world.createPowerPlant();

  assert.equal(world.householdHasEletricity(household), false);
  world.killPowerPlant(powerPlant);

  world.connectHouseholdToPowerPlant(household, powerPlant);

  assert.equal(world.householdHasEletricity(household), false);
 });
});

describe("Households + Households + Power Plants", function() {
 it("2 Households + 1 Power Plant", () => {
  const world = new World();

  const household1 = world.createHousehold();
  const household2 = world.createHousehold();
  const powerPlant = world.createPowerPlant();

  world.connectHouseholdToPowerPlant(household1, powerPlant);
  world.connectHouseholdToHousehold(household1, household2);

  assert.equal(world.householdHasEletricity(household1), true);
  assert.equal(world.householdHasEletricity(household2), true);

  world.killPowerPlant(powerPlant);

  assert.equal(world.householdHasEletricity(household1), false);
  assert.equal(world.householdHasEletricity(household2), false);
 });

 it("Power Plant -> Household -> Household -> Household", () => {
  const world = new World();

  const household1 = world.createHousehold();
  const household2 = world.createHousehold();
  const household3 = world.createHousehold();
  const powerPlant = world.createPowerPlant();

  world.connectHouseholdToPowerPlant(household1, powerPlant);
  world.connectHouseholdToHousehold(household1, household2);
  world.connectHouseholdToHousehold(household2, household3);

  assert.equal(world.householdHasEletricity(household1), true);
  assert.equal(world.householdHasEletricity(household2), true);
  assert.equal(world.householdHasEletricity(household3), true);

  world.killPowerPlant(powerPlant);

  assert.equal(world.householdHasEletricity(household1), false);
  assert.equal(world.householdHasEletricity(household2), false);
  assert.equal(world.householdHasEletricity(household3), false);

  world.repairPowerPlant(powerPlant);

  assert.equal(world.householdHasEletricity(household1), true);
  assert.equal(world.householdHasEletricity(household2), true);
  assert.equal(world.householdHasEletricity(household3), true);

  world.disconnectHouseholdFromPowerPlant(household1, powerPlant);

  assert.equal(world.householdHasEletricity(household1), false);
  assert.equal(world.householdHasEletricity(household2), false);
  assert.equal(world.householdHasEletricity(household3), false);
 });

 it("2 Households + 2 Power Plants", () => {
  const world = new World();

  const household1 = world.createHousehold();
  const household2 = world.createHousehold();

  const powerPlant1 = world.createPowerPlant();
  const powerPlant2 = world.createPowerPlant();

  world.connectHouseholdToPowerPlant(household1, powerPlant1);
  world.connectHouseholdToPowerPlant(household2, powerPlant2);

  assert.equal(world.householdHasEletricity(household1), true);
  assert.equal(world.householdHasEletricity(household2), true);


  world.killPowerPlant(powerPlant1);

  assert.equal(world.householdHasEletricity(household1), false);
  assert.equal(world.householdHasEletricity(household2), true);

  world.connectHouseholdToHousehold(household1, household2);
  assert.equal(world.householdHasEletricity(household1), true);
  assert.equal(world.householdHasEletricity(household2), true);

  world.disconnectHouseholdFromPowerPlant(household2, powerPlant2);

  assert.equal(world.householdHasEletricity(household1), false);
  assert.equal(world.householdHasEletricity(household2), false);
 });
});

window.mocha.run();
