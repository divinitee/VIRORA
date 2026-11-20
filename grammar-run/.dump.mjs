const k=process.argv[2];
const m=await import(`/app/src/lib/grammarPractice/bank/${k}.js`);
for(const it of m.default){ const s=JSON.stringify(it.slots||{});
 if(it.stage==='choose') console.log('C|',it.prompt,'|',it.options.join(' / '),'| KEY',it.options[it.key],'|',s);
 else if(it.stage==='build') console.log('B|',it.instr,'|',it.source,'| KEY',JSON.stringify(it.key),JSON.stringify(it.acceptable||[]),'|',s);
 else if(it.stage==='transform') console.log('T|',it.instr,'|',it.source,'||',it.hint,'| KEY',it.key,JSON.stringify(it.acceptable||[]),'|',s);}
