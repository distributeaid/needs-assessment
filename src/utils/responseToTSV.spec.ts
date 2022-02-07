import formExample from 'schema/form.example.json'
import type { Form } from 'schema/types'
import { responseToTSV } from 'utils/responseToTSV'

const response = {
	basicInfo: {
		email: 'alex@example.com',
		organization: 'DA',
		region: 'lesvos',
		areainfo: 'No',
	},
	timeOfYear: {
		quarter: 'q1',
	},
	whomYouServe: {
		peopleofConcern: [10000, 'people'],
		peopleSupportedMonth: [1000, 'people'],
		averagePeopleServedMonth: [30, 'servings'],
		populationTrending: 'upwards',
		aidTypes: ['food', 'clothing'],
		primaryServing: ['men', 'women'],
		clothingDistribution: ['womens', 'mens'],
	},
	additional: {
		logoUsage: 'no',
		needOtherItems: 'no',
		dontNeedItems: 'no',
		haveTooMuchItems: 'no',
		fireSafetyEquipment: 'no',
		powerBanks: 'no',
	},
	warehouse: {
		operatesWarehouse: 'no',
		storageUsage: 'p0',
		winterize: 'never',
		clearedPallets: [10, 'epa'],
		palletIntake: [10, 'epa'],
	},
}

const tsv = `Question ID	Question Title	Answer ID	Answer Title	Unit ID	Unit Title
basicInfo.email	Email Address	alex@example.com
basicInfo.organization	Organisation Name	DA
basicInfo.region	What region to you operate in?	lesvos	Lesvos
basicInfo.areainfo	Would you like to tell us the exact area that you operate in?	No
timeOfYear.quarter	Which quarter is this needs assessment for?	q1	Q1: January, February, March
whomYouServe.peopleofConcern	How many people total are there in your region who may access NGO services?	10000		people	people of concern
whomYouServe.peopleSupportedMonth	How many unique people does your organisation support in one month?	1000		people	unique people
whomYouServe.averagePeopleServedMonth	How many times on average do you serve one person over the course of one month?	30		servings	average servings/month
whomYouServe.populationTrending	Is the number of people you support trending upwards, downwards, stagnant, or hard to say?	upwards	upwards
whomYouServe.aidTypes	Which of the following types of aid does your organisation provide? Please select all that apply	food, clothing	food items, clothing
whomYouServe.primaryServing	Whom do you primarily serve? Pease select all that apply	men, women	men, women
whomYouServe.clothingDistribution	Which types of the following clothing does your organisation distribute? Please select all that apply	womens, mens	Women's clothing, men's clothing
warehouse.operatesWarehouse	Do you operate a warehouse?	no	no
warehouse.warehouseInfo	Please tell us about your storage solutions:	
warehouse.storageUsage	How full is your storage?	p0	0%
warehouse.winterize	In which month do you winterise your warehouse?	never	I don't winterize my warehouse
warehouse.clearedPallets	How many pallets do you typically clear (i.e. go through or use) each month?	10		epa	Euro pallets
warehouse.palletIntake	How many pallets per month is your warehouse typically able to take in?	10		epa	Euro pallets
warehouse.features	Please tick all that you have access to		
foodItems.rice	Rice				
foodItems.potatoes	Potatoes				
foodItems.onions	Onions				
foodItems.garlic	Garlic				
foodItems.flour	Flour				
foodItems.salt	Salt				
foodItems.sugar	Sugar				
foodItems.oil	Oil				
foodItems.milk	Milk				
foodItems.cannedTomatoes	Canned Tomatoes				
foodItems.cannedBeans	Canned Beans				
foodItems.cannedFish	Canned Fish				
foodItems.sweetcorn	Sweetcorn				
foodItems.tea	Tea				
foodItems.coffee	Coffee				
womensClothing.womensJackets	Women's Jackets				
womensClothing.womensJumpers	Women's Jumpers				
womensClothing.womensTShirts	Women's T-Shirts				
womensClothing.womensLongSlevedTops	Women's Long sleeved tops				
womensClothing.womensShorts	Women's Shorts				
womensClothing.womensTrousers	Women's Trousers				
womensClothing.womensPantsUnderwear	Women's Pants/Underwear				
womensClothing.womensSocks	Women's Socks				
womensClothing.womensShoes	Women's Shoes				
womensClothing.womensHats	Women's Hats				
womensClothing.womensScarves	Women's Scarves				
womensClothing.womensGloves	Women's Gloves				
womensClothing.womensDresses	Women's Dresses				
womensClothing.womensLeggings	Women's Leggings				
womensClothing.womensBras	Women's Bras				
womensClothing.womensHijabs	Women's Hijabs				
womensClothing.womensAbayas	Women's Abayas				
mensClothing.mensJackets	Men's Jackets				
mensClothing.mensJumpers	Men's Jumpers				
mensClothing.mensTShirts	Men's T-Shirts				
mensClothing.mensLongSlevedTops	Men's Long sleeved tops				
mensClothing.mensShorts	Men's Shorts				
mensClothing.mensTrousers	Men's Trousers				
mensClothing.mensPantsUnderwear	Men's Pants/Underwear				
mensClothing.mensSocks	Men's Socks				
mensClothing.mensShoes	Men's Shoes				
mensClothing.mensHats	Men's Hats				
mensClothing.mensScarves	Men's Scarves				
mensClothing.mensGloves	Men's Gloves				
additional.needMedicalItems	Do you have any need for medical products?		
additional.needElectricalItems	Do you have any need for electrical products?		
additional.needOtherItems	Are there any other items you need?	no	no
additional.dontNeedItems	Is there anything you do NOT need more of that you would like to make us aware of?	no	no
additional.haveTooMuchItems	Is there anything that you have too much of that could be reallocated or traded to other groups?	no	no
additional.other	Is there anything else you would like to communicate with us at this time?	
additional.logoUsage	Thank you for your time! If you'd like, we'll be highlighting some of the organisations that filled out the needs assessment in recognition of the important work being done by grassroots organisations. Your data will not be tied to you publicly. Instead we may, for example, put your organisation's name and logo on the report. If you do not opt in, we will not do this.  If you are the only organisation to respond from your region, we will not do this.  Do you give us permission to highlight your contribution by putting your name and logo on the report?	no	no`

describe('responseToTSV()', () => {
	it('should convert the response to TSV', () => {
		expect(responseToTSV(response, formExample as Form)).toEqual(tsv)
	})
})
