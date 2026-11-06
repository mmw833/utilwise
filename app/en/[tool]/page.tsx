import type {Metadata} from "next";import {notFound} from "next/navigation";import EnglishCalculator from "./EnglishCalculator";
const info:Record<string,{title:string;description:string}>={
area:{title:"Area Converter",description:"Convert square meters to pyeong and pyeong to square meters."},
loan:{title:"Loan Interest Calculator",description:"Estimate monthly repayments and total interest for equal-payment and equal-principal loans."},
brokerage:{title:"Real Estate Brokerage Fee Calculator",description:"Estimate the maximum residential brokerage fee under South Korean rules."},
salary:{title:"Take-home Salary Calculator",description:"Estimate monthly take-home pay using South Korean payroll insurance rates."},
severance:{title:"Severance Pay Calculator",description:"Estimate severance pay using South Korean labor-law calculation principles."},
savings:{title:"Savings Interest Calculator",description:"Estimate deposit and installment savings interest and maturity amounts."},
dsr:{title:"DSR Loan Capacity Calculator",description:"Simulate debt service ratio and borrowing capacity using your assumptions."},
"rent-conversion":{title:"Rent Conversion Calculator",description:"Convert between rental deposit differences and monthly rent."},
fuel:{title:"Fuel Cost Calculator",description:"Estimate trip and monthly fuel costs from distance, fuel economy, and price."},
vat:{title:"VAT Calculator",description:"Calculate VAT and the total amount using a selected rate."}
};
export function generateStaticParams(){return Object.keys(info).map(tool=>({tool}));}
export async function generateMetadata({params}:{params:Promise<{tool:string}>}):Promise<Metadata>{const {tool}=await params;const item=info[tool];if(!item)return {title:"Calculator | UTILWISE"};return {title:item.title+" | UTILWISE",description:item.description,alternates:{canonical:"/en/"+tool},openGraph:{title:item.title+" | UTILWISE",description:item.description,url:"https://utilwise.kr/en/"+tool,siteName:"UTILWISE",locale:"en_US",type:"website"}};}
export default async function Page({params}:{params:Promise<{tool:string}>}){const {tool}=await params;if(!info[tool])notFound();return <EnglishCalculator tool={tool} title={info[tool].title} description={info[tool].description}/>;}
