function require(bundleIds, callbackFn) {
  bundleIds.forEach(function(bundleId) {
    if (!loadjs.isDefined(bundleId)) loadjs(modules[bundleId], bundleId);
  });
  loadjs.ready(bundleIds, callbackFn);
}