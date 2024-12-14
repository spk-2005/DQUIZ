import Airtable from 'airtable';

const base1 = new Airtable({ apiKey: process.env.REACT_APP_AIRTABLE_API_KEY}).base(process.env.REACT_APP_AIRTABLE_BASE_ID);
export default base1;
