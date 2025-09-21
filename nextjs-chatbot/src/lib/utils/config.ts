import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

export interface ConfigData {
  directories: {
    db_path: string;
    vectordb_dir: string;
  };
  llm_config: {
    chat_model: string;
    summary_model: string;
    rag_model: string;
    temperature: number;
  };
  chat_history_config: {
    max_history_pairs: number;
    max_characters: number;
    max_tokens: number;
  };
  agent_config: {
    max_function_calls: number;
  };
  vectordb_config: {
    collection_name: string;
    embedding_model: string;
    k: number;
    use_docker?: boolean;
    docker_host?: string;
    docker_port?: number;
  };
}

export class Config {
  public readonly db_path: string;
  public readonly vectordb_dir: string;
  public readonly chat_model: string;
  public readonly summary_model: string;
  public readonly rag_model: string;
  public readonly temperature: number;
  public readonly max_history_pairs: number;
  public readonly max_characters: number;
  public readonly max_tokens: number;
  public readonly max_function_calls: number;
  public readonly collection_name: string;
  public readonly embedding_model: string;
  public readonly k: number;
  public readonly use_docker: boolean;
  public readonly docker_host: string;
  public readonly docker_port: number;

  constructor() {
    const configPath = path.join(process.cwd(), 'src/config/config.yml');
    const configData = yaml.load(fs.readFileSync(configPath, 'utf8')) as ConfigData;

    // directories
    this.db_path = path.join(process.cwd(), configData.directories.db_path);
    this.vectordb_dir = path.join(process.cwd(), configData.directories.vectordb_dir);

    // llm_config
    this.chat_model = configData.llm_config.chat_model;
    this.summary_model = configData.llm_config.summary_model;
    this.rag_model = configData.llm_config.rag_model;
    this.temperature = configData.llm_config.temperature;

    // chat_history_config
    this.max_history_pairs = configData.chat_history_config.max_history_pairs;
    this.max_characters = configData.chat_history_config.max_characters;
    this.max_tokens = configData.chat_history_config.max_tokens;

    // agent_config
    this.max_function_calls = configData.agent_config.max_function_calls;

    // vectordb_config
    this.collection_name = configData.vectordb_config.collection_name;
    this.embedding_model = configData.vectordb_config.embedding_model;
    this.k = configData.vectordb_config.k;
    this.use_docker = configData.vectordb_config.use_docker || false;
    this.docker_host = configData.vectordb_config.docker_host || 'localhost';
    this.docker_port = configData.vectordb_config.docker_port || 8000;
  }
}