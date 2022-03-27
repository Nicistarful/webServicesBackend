import express from 'express'
import { initializeApp } from 'firebase/app'
import {
	getStorage,
	list,
	ref,
	getDownloadURL,
	uploadBytes,
} from 'firebase/storage'
import { doc, setDoc, getFirestore } from 'firebase/firestore'
import fs from 'fs'
/* import pdf from 'pdf-parse' */
import fileUpload from 'express-fileupload'
import cors from 'cors'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import _ from 'lodash'

const PORT = 80
const HOST = '0.0.0.0'
const firebaseConfig = {
	apiKey: 'AIzaSyAtTDBbXDrapv5bhGNK4ezmc2LzltaGh_A',
	authDomain: 'webservicettest.firebaseapp.com',
	projectId: 'webservicettest',
	storageBucket: 'webservicettest.appspot.com',
	messagingSenderId: '1041622716387',
	appId: '1:1041622716387:web:1484a92bf9fd6990bbdad6',
}

const firebaseApp = initializeApp(firebaseConfig)
const storage = getStorage(firebaseApp)
const db = getFirestore(firebaseApp)
const reference = ref(storage)
const app = express()

app.use(
	fileUpload({
		createParentPath: true,
	})
)

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('dev'))

function getTextFromPDF(path) {
	let buffer = fs.readFileSync(path)
	let result
	/* try {
		pdf(buffer)
			.then(data => {
				result = data
			})
			.catch(err => {
				console.log(err)
			})
	} catch (err) {
		console.log(err)
	} */
	return result
}

app.get('/fetchFilenames', async (req, res) => {
	const response = await fetchFilenames()
	res.send(response)
})

app.get('/downloadFile', async (req, res) => {
	const name = req.query.name
	const url = await generateDownloadURL(name)
	res.send(url)
})

app.post('/uploadFile', async (req, res) => {
	let file = req.files.file
	let filename = file.name
	try {
		const fileRef = ref(storage, filename)
		uploadBytes(fileRef, file.data)
	} catch (err) {
		console.log(err)
	}
})

app.post('/uploadFileIndex', async (req, res) => {
	let path = req.query.path.replace(/\\/g, '\\\\')
	let filename = req.query.filename
	/* try {
		await setDoc(doc(db, 'pdfs', filename), {
			content: getTextFromPDF(path),
		})
	} catch (err) {
		console.log(err)
	} */
})

async function fetchFilenames() {
	const result = await list(reference)
	let names = []
	result.items.forEach(item => names.push(item.name))
	return names
}

async function generateDownloadURL(filename) {
	const thisRef = ref(storage, filename)
	const response = await getDownloadURL(thisRef)
	return response
}

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
