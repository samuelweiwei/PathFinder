const loadedGraph = require("../graph/loadGraph");
const logger = require('../global/logger');
const { JsonWebTokenError } = require("jsonwebtoken");
exports.routesWithMaxStops = (req, res, next) => {
  const src = req.query.src;
  const dest = req.query.dest;
  const stopsStr = req.query.stops;
  if ((!src) || !checkNode(src)) {
    logger.error(`No source start place: ${src}`);
    return res
      .status(400)
      .send({ result: "failed", errors: `No source start place: ${src}` });
  }
  if ((!dest) || !checkNode(dest)){
    logger.error(`No destination place: ${dest}`);
    return res
      .status(400)
      .send({ result: "failed", errors: `No destination place: ${dest}` });
  }
  if (!stopsStr) {
    logger.error(`No stops number: ${stopsStr}`);
    return res
      .status(400)
      .send({ result: "failed", errors: `No stops number: ${stopsStr}` });
  }
  if (isNaN(stopsStr.trim())) {
    logger.error(`Stops number is not number: ${stopsStr}`);
    return res
      .status(400)
      .send({
        result: "failed",
        errors: `Stops number is not number: ${stopsStr}`,
      });
  }
  try {
    const stops = parseInt(stopsStr.trim());
    const routes = loadedGraph.findRoutesWithMaxStops(src, dest, stops);
    const finalRet = loadedGraph.filterDuplicates(routes);
    logger.info(`[routesWithMaxStops] acquire routes: ${JSON.stringify(finalRet)}`);
    if (routes){
      return res.status(200).send({result: "succeeded", msg: routes});
    }
    return res.status(200).send({result:"failed", msg: []});
  } catch (error) {
    logger.error(error);
    return res.status(400).send({ result: "failed", msg: 'Exception occured with graph algorithms' });
  }
};

exports.routesWithFixedStops = (req, res, next) => {
  const src = req.query.src;
  const dest = req.query.dest;
  const stopsStr = req.query.stops;
  if ((!src) || !checkNode(src)) {
    logger.error(`No source start place: ${src}`);
    return res
      .status(400)
      .send({ result: "failed", errors: `No source start place: ${src}` });
  }
  if ((!dest) || !checkNode(dest)) {
    logger.error(`No destination place: ${dest}`);
    return res
      .status(400)
      .send({ result: "failed", errors: `No destination place: ${dest}` });
  }
  if (!stopsStr) {
    logger.error(`No stops number: ${stopsStr}`);
    return res
      .status(400)
      .send({ result: "failed", errors: `No stops number: ${stopsStr}` });
  }
  if (isNaN(stopsStr.trim())) {
    logger.error(`Stops number is not number: ${stopsStr}`);
    return res
      .status(400)
      .send({
        result: "failed",
        errors: `Stops number is not number: ${stopsStr}`,
      });
  }
  try {
    const stops = parseInt(stopsStr.trim());
    const routes = loadedGraph.findRoutesWithExactStops(src, dest, stops);
    const finalRet = loadedGraph.filterDuplicates(routes);
    logger.info(`[routesWithFixedStops] acquire routes: ${JSON.stringify(finalRet)}`);
    if (routes){
      return res.status(200).send({result: "succeeded", msg: routes });
    }
    return res.status(200).send({result:"failed", msg: []});
  } catch (error) {
    logger.error(error);
    return res.status(400).send({ result: "failed", msg: 'Exception occured with graph algorithms' });
  }
};

exports.routesWithMaxDist = (req, res, next) => {
  const src = req.query.src;
  const dest = req.query.dest;
  const distStr = req.query.dist;
  if ((!src) || !checkNode(src)) {
    logger.error(`No source start place: ${src}`);
    res
      .status(400)
      .send({ result: "failed", errors: `No source start place: ${src}` });
    return;
  }
  if ((!dest) || !checkNode(dest)) {
    logger.error(`No destination place: ${dest}`);
    res
      .status(400)
      .send({ result: "failed", errors: `No destination place: ${dest}` });
    return;
  }
  if (!distStr) {
    logger.error(`No distance number: ${distStr}`);
    res
      .status(400)
      .send({ result: "failed", errors: `No distance number: ${distStr}` });
    return;
  }
  if (isNaN(distStr.trim())) {
    logger.error(`Distance number is not number: ${distStr}`);
    res
      .status(400)
      .send({
        result: "failed",
        errors: `Distance number is not number: ${distStr}`,
      });
    return;
  }
  try {
    const dist = parseInt(distStr.trim());
    const routes = loadedGraph.findRouteWithMaxDistances(src, dest, dist);
    const finalRet = loadedGraph.filterDuplicates(routes);
    logger.info(`[routesWithMaxDist] acquire routes: ${JSON.stringify(finalRet)}`);
    if (routes) {
      return res.status(200).send({ result: "succeeded", msg: routes });
    }
    return res.status(200).send({result:"failed", msg: []});
  } catch (error) {
    logger.error(error)
    return res.status(400).send({ result: "failed", msg: 'Exception occured with graph algorithms' });
  }
};

exports.shortestPath = (req, res, next) => {
  const src = req.query.src;
  const dest = req.query.dest;
  if ((!src) || !checkNode(src)) {
    logger.error(`No source start place: ${src}`);
    return res
      .status(400)
      .send({ result: "failed", errors: `No source start place: ${src}` });
  }
  if ((!dest) || !checkNode(dest)) {
    logger.error(`No destination place: ${dest}`);
    return res
      .status(400)
      .send({ result: "failed", errors: `No destination place: ${dest}` });
  }
  try {
    const routes = loadedGraph.shortestPathDijkstra(src, dest);
    logger.info(`[shortestPath] acquire routes: ${JSON.stringify(routes)}`);
    if (routes){
      return res.status(200).send({ result: "succeeded", msg: routes });
    }
    return res.status(200).send({result:"failed", msg: []});
  } catch (error) {
    return res.status(400).send({ result: "failed", msg: 'Exception occured with graph algorithms' });
  }
};

exports.distances = (req, res, next) => {
  try {
    const paths = req.query.stops;
    console.log(paths);
    const distance = loadedGraph.calculatePathDistance(paths);
    logger.info(`[distances] get distance: ${distance}`);
    return res.status(200).send({ result: "succeeded", msg: { distance: distance } });
  } catch (error) {
    logger.error(error);
    return res.status(400).send({ result: "failed", msg: 'Exception occured with graph algorithms' });
  }
};

function checkNode(node){
  if (loadedGraph.adjList.has(node)){
    return true;
  }else{
    return false;
  }
}