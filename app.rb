require 'rubygems'
require 'sinatra'
require 'datamapper'
require 'dm-paperclip'
require 'haml'
require 'sass'
require 'json'
require 'fileutils'
require 'sinatra/reloader' if development?
require 'aws/s3'
require 'secret'

APP_ROOT = File.expand_path(File.dirname(__FILE__))

DataMapper::setup(:default, "sqlite3://#{APP_ROOT}/db.sqlite3")

class Image
 
  include DataMapper::Resource
  include Paperclip::Resource

  property :id,     Serial

  has_attached_file :file,
                    :url => "/:id/:style/:basename.:extension",
                    :path => "/:id/:style/:basename.:extension",
                    :storage => :s3,
                    :s3_credentials => {
                      :access_key_id => @@aws_access,
                      :secret_access_key => @@aws_secret,
                      :bucket => @@bucket
                    },
                    :styles => {:medium => '400x400>', :thumb => '150x150#'}
                    
end

Image.auto_migrate!

def make_paperclip_mash(file_hash)
  mash = Mash.new
  mash['tempfile'] = file_hash[:tempfile]
  mash['filename'] = file_hash[:filename]
  mash['content_type'] = file_hash[:type]
  mash['size'] = file_hash[:tempfile].size
  mash
end

get '/' do
  haml :index
end

post '/save' do
  halt 409, "error" unless params[:file][:tempfile].size > 0
  @image = Image.new(:file => make_paperclip_mash(params[:file]))
  halt 409, "error" unless @image.save
  
  content_type :json
  { :url => @image.file.url(:medium) }.to_json
  
end

post '/crop' do
  # Actual cropping
  haml :result
end

get '/stylesheets/global.css' do
  content_type 'text/css', :charset => 'utf-8'
  sass :global
end