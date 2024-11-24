import { url } from "inspector";
import {getTodosPosts, criarPost, atualizarPost} from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js"

export async function listarPosts  ( req, res) { 
    const posts =  await getTodosPosts();
    // Chama a função para obter todos os posts
    res.status(200).json(posts);
    // Envia os posts como resposta JSON com o código de status 200 (OK)
}

export async function postarNovoPost(req, res){
    const novoPost = req.body;
    try {
        const postCriado = await criarPost(novoPost);
        res.status(200).json(postCriado);
    } catch(erro) {
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"})
    }
} 

export async function uploadImagem(req, res){
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt:""
    };
     
    
    try {
        const postCriado = await criarPost(novoPost);
        const imagemAutalizada = `uploads/${postCriado.insertedId}.png`
        fs.renameSync(req.file.path, imagemAutalizada)
        res.status(200).json(postCriado);
    } catch(erro) {
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"})
    }
} 

export async function atualizarNovoPost(req, res){
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`

    try {
        const imageBuffer = fs.readFileSync(`uploads/${id}.png`)
        const descricao = await gerarDescricaoComGemini(imageBuffer)

        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        }

        const postCriado = await atualizarPost(id, post);
        res.status(200).json(postCriado);
    } catch(erro) {
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"})
    }
} 