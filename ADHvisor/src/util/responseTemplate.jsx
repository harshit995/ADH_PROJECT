const getResponseTemplate = length => {
  const starting = [
    `These are the last ${length} Transactions IDs related to your query.`,
    `Here are the last ${length} Transactions IDs matching your query.`,
    `Presenting the last ${length} Transactions IDs we discovered linked to your query.`,
    `Here are the last ${length} Transactions IDs associated with your query.`,
    `Highlighted below are the last ${length} Transactions IDs we found in relation to your query.`,
    `Here are the last ${length} Transactions IDs that the query yielded.`,
    `Here are the last ${length} Transactions IDs we found corresponding to your query.`,
    `Here are the last ${length} Transactions IDs located that match your query.`,
    `Provided below are the last ${length} Transactions IDs resulting from your query.`,
  ];
  const randomIndex1 = Math.floor(Math.random() * starting.length);
  const randomIndex2 = Math.floor(Math.random() * starting.length);

  const ending = [
    'To learn more, simply choose one of these IDs.',
    'Select any of these IDs for further details.',
    'Select any of these IDs to explore further details.',
    'Select any of these IDs to explore further details.',
    'Choose any of these IDs to discover more details.',
    'You can select any of these IDs to uncover more details.',
    'To learn more about each, select any of these IDs.',
    'To explore further details, select any of these IDs.',
    'Select any of these IDs to access more information.',
  ];
  return { start: starting[randomIndex1], end: ending[randomIndex2] };
};

export default getResponseTemplate;
