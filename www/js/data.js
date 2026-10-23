const F={flex:{pre:15,coef:1.1,min:1,ico:"⚡"},fam:{pre:30,coef:1,min:1,ico:"👨‍👩‍👧"},cou:{pre:30,coef:1,min:3,ico:"💑"},ser:{pre:30,coef:1,min:1,ico:"🌿"}};
const P={all:["flex","fam","cou","ser"],stag:["flex"],trav:["flex","fam"],fam:["fam"],cou:["cou","flex"],age:["ser","fam"]};
const SEED=[
{id:"s1",o:0,tk:"studio",v:"Casablanca",q:"Maârif",p:3200,r:1,m:35,a:false,pr:["stag","trav","cou"],e:"🛋️"},
{id:"s2",o:0,tk:"apt3",v:"Casablanca",q:"Oulfa",p:4500,r:2,m:80,a:true,pr:["fam","trav","age"],e:"🏢"},
{id:"s3",o:0,tk:"room",v:"Rabat",q:"Agdal",p:3800,r:1,m:50,a:false,pr:["stag","cou","trav"],e:"🌆"},
{id:"s4",o:0,tk:"ground",v:"Casablanca",q:"Aïn Diab",p:5200,r:2,m:90,a:true,pr:["age","fam"],e:"🌴"},
{id:"s5",o:0,tk:"family",v:"Marrakech",q:"Guéliz",p:4800,r:3,m:105,a:true,pr:["fam","age"],e:"🕌"},
{id:"s6",o:0,tk:"univ",v:"Rabat",q:"Hay Riad",p:2600,r:1,m:28,a:false,pr:["stag","trav"],e:"🎓"}];
