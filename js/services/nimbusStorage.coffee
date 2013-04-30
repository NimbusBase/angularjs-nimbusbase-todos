Nimbus.angularService = ()->

	(name, attrs, sync_callback)->
		store = Nimbus.Model.setup(name, attrs)
		store.sync_all(sync_callback)
		store