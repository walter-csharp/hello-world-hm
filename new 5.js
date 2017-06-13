db.products.aggregate([
	{$group:
		{
			_id:"$manufacturer",
			num_products:{$sum:1}
		}
		
	}
])

db.products.aggregate([
	{$group:
		{
			_id:"$category",
			num_products:{$sum:1}
		}
	}
])

Aggreation PipeLine					Aggreation Expression Overview(group)  $project   
$project	- reshape	- 1:1		$sum									*Remove keys
$match		- filter	- n:1		$avg									*Add Keys
$group		- aggregate	- n:1		$min									*Reshape Keys
$sort		- sort		- 1:1		$max									*Use some simple functions on keys
$skip		- skip		- n:1		$push										-$toUpper
$limit		- limit		- n:1		$addtoset									-$toLower
$unwind		- normalize	- 1:n		$first										-$add
$out		- out		- 1:1		$last										-$multiply
------------------------------
$redact
$geoNear 

$sort
*disk or Memory Based
	//if it is memory based means it is 100MB
*Before or After the grouping stage

//Compound/MultiKey Aggregate
db.products.aggregate([
	{$group:
		{
			_id:{
				"maker":"$manufacturer",
				"category":"$category"},
			num_products:{$sum:1}
		}
	}
])

db.products.aggregate([
	{$group:
		{
			_id:"$manufacturer",
			num_products:{$sum:"$price"}
		}	
	}
])

db.zips.aggregate([
	{$group:
		{
			_id:"$state",
			population :{$sum:"$pop"}
		}		
	}
])

//Average
db.products.aggregate([
	{$group:
		{
			_id:{
				"category":"$category"
			},
			avg_price:{$avg:"$price"}
		}	
	}
])

db.zips.aggregate([
	{$group:
		{
			_id:"$state",
			average_pop:{$avg:"$pop"}
		}		
	}
])

//addtoset
db.products.aggregate([
	{$group:
		{
			_id:{
				"maker":"$manufacturer"
			},
			categories:{$addToSet:"$category"}
		}	
	}
])

db.zips.aggregate([
	{$group:
		{
			_id:"$city",
			postal_codes:{$addToSet:"$_id"}
		}		
	}
])


//push
db.products.aggregate([
	{$group:
		{
			_id:{
				"maker":"$manufacturer"
			},
			categories:{$push:"$category"}
		}	
	}
])

//max
db.products.aggregate([
	{$group:
		{
			_id:{
				"maker":"$manufacturer"
			},
			maxprice:{$max:"$price"}
		}	
	}
])

db.zips.aggregate([
	{$group:
		{
			_id:"$state",
			pop:{$max:"$pop"}
		}		
	}
])

//Douple  Grouping
db.grades.aggregate([
	{$group:
		{
			_id:{
				"class_id":"$class_id",
				"student_id":"$student_id"
			},
			average:{$avg:"$score"}
		}	
	},
	{$group:
		{
			_id:"$_id.class_id",
			average:{$avg:"$average"}
		}	
	}
])

//project
db.products.aggregate([
	{$project:
		{
			_id:0,
			'maker':{$toLower:'$manufacturer'},
			'details':{'category':"$category",
					   'price':{"$multiply":["$price",10]}
			},
			'item':'$name'
		}	
	}
])

db.zips.aggregate([
	{$project:
		{
			_id:0,
			'city':{$toLower:'$city'},
			'pop':1,
			'state':1,
			'zip':"$_id"
		}	
	}
])

//match
db.zips.aggregate([
	{$match:
		{		
			state:"CA"			
		}	
	},
	{$group:
		{
			_id:"$city",
			population:{$sum:"$pop"},
			zip_codes:{$addToSet:"$_id"}
		}
	},
	{$project:
		{
			_id:0,
			city:'$_id',
			population:1,
			zip_codes:1
		}
	}
])

db.zips.aggregate([
	{$match:
		{		
			pop:{$gt:100000}			
		}	
	}
])

//sort
db.zips.aggregate([
	{$match:
		{		
			state:"CA"			
		}	
	},
	{$group:
		{
			_id:"$city",
			population:{$sum:"$pop"},
			zip_codes:{$addToSet:"$_id"}
		}
	},
	{$project:
		{
			_id:0,
			city:'$_id',
			population:1,
			zip_codes:1
		}
	},
	{$sort:
		{
			population:-1
		}
	}
])

db.zips.aggregate([
	{$sort:
		{
			state:1,
			city:1
		}
	}
])

//skip & limit
db.zips.aggregate([
	{$match:
		{		
			state:"CA"			
		}	
	},
	{$group:
		{
			_id:"$city",
			population:{$sum:"$pop"},
			zip_codes:{$addToSet:"$_id"}
		}
	},
	{$project:
		{
			_id:0,
			city:'$_id',
			population:1,
			zip_codes:1
		}
	},
	{$sort:
		{
			population:-1
		}
	},
	{$skip:10},
	{$limit:5}	
])

//First & last
db.zips.aggregate([
	/*get the population of every city in every state*/
	{$group:
		{
			_id:{state:"$state",city:"$city"},
			population:{$sum:"$pop"}
		}
	},
	/*sort by state, population*/
	{$sort:
		{"_id.state":1,"population":-1}
	},
	/*group by state, get the first item in each group*/
	{$group:
		{
			_id:"$_id.state",
			city:{$first:"$_id.city"},
			population:{$first:"$population"},
		}
	},
	/*now sort by state again*/
	{$sort:
		{"_id":1}
	}
])

//Unwind
db.posts.aggregate([
	/*unwind by tags*/
	{"$unwind":"$tags"},
	/*now group by tags, counting each tag*/
	{$group:
		{
			"_id":"$tags",
			"count":{$sum:1}
		}
	},
	/*sort by popularity*/
	{$sort:{"count":-1}},
	/*show me the top 10*/
	{$limit:10}
	/*change the name of _id to be the tag*/
	{$project:
		{
			_id:0,
			tag:'$_id',
			count:1
		
		}
	}
])

//Double unwind
db.inventory.aggregate{[
	{$unwind:"$sizes"},
	{$unwind:"$colors"},
	{$group:
		{
			_id:{'size':'$sizes','color':'$colors'},
			'count':{$sum:1}
		}
	}
]}

//Reversing double unwind
db.inventory.aggregate{[
	{$unwind:"$sizes"},
	{$unwind:"$colors"},
	/*create the color array*/
	{$group:
		{
			_id:{'name':'$name','size':'$sizes'},
			'colors':{$push:'$colors'}
		}
	},
	/*create the size array*/
	{$group:
		{
			_id:{'name':'$_id.name','colors':'$colors'},
			'sizes':{$push:'$_id.sizes'}
		}
	},
	/*reshape for beauty*/
	{$project:
		{
			_id:0,
			'name':'$_id.name',
			'sizes':1,
			'colors':'$_id.colors'
		}
	}
]}

//Reversing addToSet
db.inventory.aggregate{[
	{$unwind:"$sizes"},
	{$unwind:"$colors"},
	{$group:
		{
			_id:'$name',
			'sizes':{$addToSet:'$sizes'},
			'colors':{$addToSet:'$colors'}
		}
	}
]}